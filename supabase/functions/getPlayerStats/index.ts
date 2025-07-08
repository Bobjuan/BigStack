// Import necessary libraries from Deno's standard library and Supabase's function helper
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

// Define an interface for the raw stats data we expect from the database
interface PlayerStatsRaw {
  player_id: string;
  hands_played: number;
  vpip_opportunities: number;
  vpip_actions: number;
  pfr_opportunities: number;
  pfr_actions: number;
  // We can add other raw stats here as we track more things
}

// Define an interface for the clean, calculated stats we will return
interface PlayerStatsClean {
  playerId: string;
  handsPlayed: number;
  vpip: number | null; // Use null for stats that can't be calculated
  pfr: number | null;
}

// Helper function to calculate a percentage, returning null if not possible
const calculateStat = (actions: number, opportunities: number): number | null => {
  if (opportunities === 0) {
    return null; // Cannot divide by zero
  }
  return Math.round((actions / opportunities) * 100);
};

// Start serving the function
serve(async (req, ctx) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    // AUTH: Use Supabase Edge Function context for user authentication
    // See: https://supabase.com/docs/guides/functions/auth
    const { user } = ctx ?? {};
    if (!user || !user.id) {
      return new Response(JSON.stringify({ error: "Unauthorized: No user found in context." }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // 1. EXTRACT DATA FROM REQUEST
    const { userId } = await req.json();
    if (!userId) {
      throw new Error("User ID is required.");
    }
    // Only allow access to own stats
    if (user.id !== userId) {
      return new Response(JSON.stringify({ error: "Forbidden: You can only access your own stats." }), {
        status: 403,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // 2. FETCH RAW STATS FROM DATABASE
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    const { data, error } = await supabaseClient
      .from("player_stats")
      .select("*")
      .eq("player_id", userId)
      .single();

    if (error) {
      // This could mean the player was not found or a real db error occurred.
      console.error("Supabase error:", error.message);
      throw new Error(`Could not fetch stats for player: ${error.message}`);
    }

    if (!data) {
      // Handle the case where the player has no stats entry yet.
      return new Response(JSON.stringify({ message: "No stats found for this player." }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const rawStats: PlayerStatsRaw = data;

    // 3. CALCULATE FINAL STATS
    const cleanStats: PlayerStatsClean = {
      playerId: rawStats.player_id,
      handsPlayed: rawStats.hands_played,
      vpip: calculateStat(rawStats.vpip_actions, rawStats.vpip_opportunities),
      pfr: calculateStat(rawStats.pfr_actions, rawStats.pfr_opportunities),
    };

    // 4. RETURN CLEAN DATA
    return new Response(JSON.stringify(cleanStats), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // IMPORTANT: For production, lock this down to your chatbot's domain
      },
      status: 200,
    });
  } catch (err) {
    // Generic error handler
    return new Response(String(err?.message ?? err), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}); 