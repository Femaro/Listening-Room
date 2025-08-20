import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const category_type = url.searchParams.get('category_type');
    const volunteer_id = url.searchParams.get('volunteer_id');

    let specializationsQuery = sql`
      SELECT 
        vs.id,
        vs.name,
        vs.description,
        vs.category_type,
        vs.icon_name,
        vs.is_active,
        COUNT(vsa.volunteer_id) as volunteer_count
      FROM volunteer_specializations vs
      LEFT JOIN volunteer_specialization_assignments vsa ON vs.id = vsa.specialization_id
      WHERE vs.is_active = true
    `;

    if (category_type) {
      specializationsQuery = sql`
        SELECT 
          vs.id,
          vs.name,
          vs.description,
          vs.category_type,
          vs.icon_name,
          vs.is_active,
          COUNT(vsa.volunteer_id) as volunteer_count
        FROM volunteer_specializations vs
        LEFT JOIN volunteer_specialization_assignments vsa ON vs.id = vsa.specialization_id
        WHERE vs.is_active = true AND vs.category_type = ${category_type}
      `;
    }

    specializationsQuery = sql`${specializationsQuery}
      GROUP BY vs.id, vs.name, vs.description, vs.category_type, vs.icon_name, vs.is_active
      ORDER BY vs.category_type, vs.name
    `;

    const specializations = await specializationsQuery;

    // If volunteer_id is provided, get their current assignments
    let volunteerAssignments = [];
    if (volunteer_id) {
      volunteerAssignments = await sql`
        SELECT 
          vsa.specialization_id,
          vsa.experience_level,
          vsa.years_experience,
          vsa.certification_details,
          vsa.is_primary_specialization,
          vs.name as specialization_name
        FROM volunteer_specialization_assignments vsa
        JOIN volunteer_specializations vs ON vsa.specialization_id = vs.id
        WHERE vsa.volunteer_id = ${volunteer_id}
      `;
    }

    // Group specializations by category
    const categorizedSpecializations = specializations.reduce((acc, spec) => {
      if (!acc[spec.category_type]) {
        acc[spec.category_type] = [];
      }
      
      const assignmentInfo = volunteerAssignments.find(
        assignment => assignment.specialization_id === spec.id
      );

      acc[spec.category_type].push({
        id: spec.id,
        name: spec.name,
        description: spec.description,
        icon_name: spec.icon_name,
        volunteer_count: parseInt(spec.volunteer_count),
        is_assigned: !!assignmentInfo,
        assignment_details: assignmentInfo || null
      });
      return acc;
    }, {});

    return Response.json({
      specializations: specializations.map(spec => ({
        id: spec.id,
        name: spec.name,
        description: spec.description,
        category_type: spec.category_type,
        icon_name: spec.icon_name,
        volunteer_count: parseInt(spec.volunteer_count)
      })),
      categorized_specializations: categorizedSpecializations,
      volunteer_assignments: volunteerAssignments,
      total_specializations: specializations.length
    });

  } catch (error) {
    console.error('Error fetching volunteer specializations:', error);
    return Response.json(
      { error: 'Failed to fetch volunteer specializations' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { 
      specialization_assignments,
      action = 'update' // 'update', 'add', 'remove'
    } = await request.json();

    // Verify user is a volunteer
    const userProfile = await sql`
      SELECT user_type FROM user_profiles 
      WHERE user_id = ${session.user.id}
    `;

    if (userProfile.length === 0 || userProfile[0].user_type !== 'volunteer') {
      return Response.json(
        { error: 'Only volunteers can assign specializations' },
        { status: 403 }
      );
    }

    if (action === 'update') {
      // Remove all existing assignments and add new ones
      await sql`
        DELETE FROM volunteer_specialization_assignments 
        WHERE volunteer_id = ${session.user.id}
      `;

      if (specialization_assignments && specialization_assignments.length > 0) {
        const insertPromises = specialization_assignments.map(assignment => {
          return sql`
            INSERT INTO volunteer_specialization_assignments (
              volunteer_id,
              specialization_id,
              experience_level,
              years_experience,
              certification_details,
              is_primary_specialization
            ) VALUES (
              ${session.user.id},
              ${assignment.specialization_id},
              ${assignment.experience_level || 'beginner'},
              ${assignment.years_experience || 0},
              ${assignment.certification_details || null},
              ${assignment.is_primary_specialization || false}
            )
          `;
        });

        await Promise.all(insertPromises);
      }
    } else if (action === 'add') {
      // Add new specialization assignment
      const assignment = specialization_assignments[0];
      await sql`
        INSERT INTO volunteer_specialization_assignments (
          volunteer_id,
          specialization_id,
          experience_level,
          years_experience,
          certification_details,
          is_primary_specialization
        ) VALUES (
          ${session.user.id},
          ${assignment.specialization_id},
          ${assignment.experience_level || 'beginner'},
          ${assignment.years_experience || 0},
          ${assignment.certification_details || null},
          ${assignment.is_primary_specialization || false}
        )
        ON CONFLICT (volunteer_id, specialization_id) 
        DO UPDATE SET 
          experience_level = EXCLUDED.experience_level,
          years_experience = EXCLUDED.years_experience,
          certification_details = EXCLUDED.certification_details,
          is_primary_specialization = EXCLUDED.is_primary_specialization
      `;
    } else if (action === 'remove') {
      // Remove specific specialization assignment
      const assignment = specialization_assignments[0];
      await sql`
        DELETE FROM volunteer_specialization_assignments 
        WHERE volunteer_id = ${session.user.id} 
          AND specialization_id = ${assignment.specialization_id}
      `;
    }

    // Get updated assignments
    const updatedAssignments = await sql`
      SELECT 
        vsa.specialization_id,
        vsa.experience_level,
        vsa.years_experience,
        vsa.certification_details,
        vsa.is_primary_specialization,
        vs.name as specialization_name,
        vs.category_type
      FROM volunteer_specialization_assignments vsa
      JOIN volunteer_specializations vs ON vsa.specialization_id = vs.id
      WHERE vsa.volunteer_id = ${session.user.id}
      ORDER BY vsa.is_primary_specialization DESC, vs.name
    `;

    return Response.json({
      success: true,
      message: 'Specialization assignments updated successfully',
      assignments: updatedAssignments,
      total_assignments: updatedAssignments.length
    });

  } catch (error) {
    console.error('Error updating volunteer specializations:', error);
    return Response.json(
      { error: 'Failed to update specializations' },
      { status: 500 }
    );
  }
}