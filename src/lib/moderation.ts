import { supabase } from "@/integrations/supabase/client";

export interface ModerationResult {
  flagged: boolean;
  reason: string | null;
}

export const moderateContent = async (content: string): Promise<ModerationResult> => {
  try {
    const { data, error } = await supabase.functions.invoke('moderate-content', {
      body: { content },
    });

    if (error) {
      console.error('Moderation error:', error);
      return { flagged: false, reason: null };
    }

    return { flagged: !!data?.flagged, reason: data?.reason || null };
  } catch (e) {
    console.error('Moderation failed:', e);
    return { flagged: false, reason: null };
  }
};
