import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a volunteer
    const userProfile = await sql`
      SELECT user_type FROM user_profiles WHERE user_id = ${session.user.id}
    `;

    if (userProfile.length === 0 || userProfile[0].user_type !== "volunteer") {
      return Response.json(
        { error: "Only volunteers can access training modules" },
        { status: 403 }
      );
    }

    // Get all training modules with user's progress
    const modules = await sql`
      SELECT 
        tm.*,
        vtp.status,
        vtp.started_at,
        vtp.completed_at,
        vtp.score,
        vtp.attempts,
        vtp.last_accessed
      FROM training_modules tm
      LEFT JOIN volunteer_training_progress vtp ON tm.id = vtp.module_id 
        AND vtp.volunteer_id = ${session.user.id}
      WHERE tm.is_active = true
      ORDER BY tm.module_order ASC
    `;

    // Calculate overall progress
    const totalModules = modules.length;
    const completedModules = modules.filter(m => m.status === 'completed').length;
    const requiredModules = modules.filter(m => m.is_required).length;
    const completedRequiredModules = modules.filter(m => m.is_required && m.status === 'completed').length;

    const overallProgress = {
      totalModules,
      completedModules,
      requiredModules,
      completedRequiredModules,
      completionPercentage: totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0,
      requiredCompletionPercentage: requiredModules > 0 ? Math.round((completedRequiredModules / requiredModules) * 100) : 100,
      isFullyTrained: completedRequiredModules === requiredModules
    };

    return Response.json({
      modules,
      progress: overallProgress
    });

  } catch (error) {
    console.error("Error fetching training modules:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a volunteer
    const userProfile = await sql`
      SELECT user_type FROM user_profiles WHERE user_id = ${session.user.id}
    `;

    if (userProfile.length === 0 || userProfile[0].user_type !== "volunteer") {
      return Response.json(
        { error: "Only volunteers can access training modules" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { moduleId, action, answers } = body;

    if (!moduleId || !action) {
      return Response.json(
        { error: "Module ID and action are required" },
        { status: 400 }
      );
    }

    // Get module details
    const module = await sql`
      SELECT * FROM training_modules WHERE id = ${moduleId} AND is_active = true
    `;

    if (module.length === 0) {
      return Response.json(
        { error: "Module not found" },
        { status: 404 }
      );
    }

    const moduleData = module[0];

    if (action === 'start') {
      // Start or resume module
      const existingProgress = await sql`
        SELECT * FROM volunteer_training_progress 
        WHERE volunteer_id = ${session.user.id} AND module_id = ${moduleId}
      `;

      if (existingProgress.length === 0) {
        // Create new progress record
        await sql`
          INSERT INTO volunteer_training_progress 
          (volunteer_id, module_id, status, started_at, last_accessed)
          VALUES (${session.user.id}, ${moduleId}, 'in_progress', NOW(), NOW())
        `;
      } else {
        // Update existing progress
        await sql`
          UPDATE volunteer_training_progress 
          SET status = 'in_progress', 
              last_accessed = NOW(),
              started_at = COALESCE(started_at, NOW())
          WHERE volunteer_id = ${session.user.id} AND module_id = ${moduleId}
        `;
      }

      return Response.json({
        message: "Module started successfully",
        moduleData: {
          id: moduleData.id,
          title: moduleData.title,
          description: moduleData.description,
          content: moduleData.content,
          video_url: moduleData.video_url,
          duration_minutes: moduleData.duration_minutes,
          quiz_data: moduleData.quiz_data
        }
      });

    } else if (action === 'complete') {
      // Complete module (with optional quiz)
      let score = null;
      let status = 'completed';

      if (moduleData.quiz_data && answers) {
        // Calculate quiz score
        const quiz = moduleData.quiz_data;
        const questions = quiz.questions || [];
        let correctAnswers = 0;

        questions.forEach((question, index) => {
          const userAnswer = answers[index];
          const correctAnswer = question.correctAnswer;
          if (userAnswer === correctAnswer) {
            correctAnswers++;
          }
        });

        score = Math.round((correctAnswers / questions.length) * 100);
        
        // Check if passed
        const passingScore = moduleData.passing_score || 80;
        if (score < passingScore) {
          status = 'failed';
        }
      }

      // Update progress
      const attempts = await sql`
        SELECT attempts FROM volunteer_training_progress 
        WHERE volunteer_id = ${session.user.id} AND module_id = ${moduleId}
      `;

      const currentAttempts = attempts.length > 0 ? attempts[0].attempts : 0;

      await sql`
        UPDATE volunteer_training_progress 
        SET status = ${status},
            completed_at = CASE WHEN ${status} = 'completed' THEN NOW() ELSE completed_at END,
            score = ${score},
            attempts = ${currentAttempts + 1},
            last_accessed = NOW()
        WHERE volunteer_id = ${session.user.id} AND module_id = ${moduleId}
      `;

      return Response.json({
        message: status === 'completed' ? "Module completed successfully!" : "Quiz failed. Please try again.",
        status,
        score,
        passingScore: moduleData.passing_score || 80,
        attempts: currentAttempts + 1
      });

    } else {
      return Response.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("Error updating training progress:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}