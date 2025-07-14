-- Drop the existing function first
DROP FUNCTION IF EXISTS batch_update_player_stats(jsonb);

-- Create the batch_update_player_stats RPC function with correct parameter handling
CREATE OR REPLACE FUNCTION batch_update_player_stats(params jsonb)
RETURNS void AS $$
DECLARE
    update_record jsonb;
    player_uuid UUID;
    increments_data jsonb;
    position_data jsonb;
    pos_key text;
    pos_stats jsonb;
BEGIN
    -- Loop through each update in the batch
    FOR update_record IN SELECT * FROM jsonb_array_elements(params->'updates')
    LOOP
        -- Extract the player ID and data
        player_uuid := (update_record->>'p_player_id')::UUID;
        increments_data := update_record->'p_increments';
        position_data := update_record->'p_position_increments';
        
        -- UPSERT the main stats (insert if new, update if exists)
        INSERT INTO player_stats (
            player_id,
            hands_played,
            hands_won,
            total_bb_won,
            total_pot_size_won,
            vpip_opportunities,
            vpip_actions,
            pfr_opportunities,
            pfr_actions,
            btn_rfi_opportunities,
            btn_rfi_actions,
            threeb_opportunities,
            threeb_actions,
            fold_vs_3bet_opportunities,
            fold_vs_3bet_actions,
            fourbet_opportunities,
            fourbet_actions,
            fold_vs_4bet_opportunities,
            fold_vs_4bet_actions,
            agg_bets,
            agg_raises,
            agg_calls,
            cbet_flop_opportunities,
            cbet_flop_actions,
            fold_vs_cbet_flop_opportunities,
            fold_vs_cbet_flop_actions,
            raise_vs_cbet_flop_opportunities,
            raise_vs_cbet_flop_actions,
            ch_raise_flop_opportunities,
            ch_raise_flop_actions,
            donk_flop_opportunities,
            donk_flop_actions,
            wtsd_opportunities,
            wtsd_actions,
            wsd_opportunities,
            wsd_actions,
            wwsf_opportunities,
            wwsf_actions
        ) VALUES (
            player_uuid,
            COALESCE((increments_data->>'hands_played')::INTEGER, 0),
            COALESCE((increments_data->>'hands_won')::INTEGER, 0),
            COALESCE((increments_data->>'total_bb_won')::INTEGER, 0),
            COALESCE((increments_data->>'total_pot_size_won')::INTEGER, 0),
            COALESCE((increments_data->>'vpip_opportunities')::INTEGER, 0),
            COALESCE((increments_data->>'vpip_actions')::INTEGER, 0),
            COALESCE((increments_data->>'pfr_opportunities')::INTEGER, 0),
            COALESCE((increments_data->>'pfr_actions')::INTEGER, 0),
            COALESCE((increments_data->>'btn_rfi_opportunities')::INTEGER, 0),
            COALESCE((increments_data->>'btn_rfi_actions')::INTEGER, 0),
            COALESCE((increments_data->>'3bet_opportunities')::INTEGER, 0),
            COALESCE((increments_data->>'3bet_actions')::INTEGER, 0),
            COALESCE((increments_data->>'fold_vs_3bet_opportunities')::INTEGER, 0),
            COALESCE((increments_data->>'fold_vs_3bet_actions')::INTEGER, 0),
            COALESCE((increments_data->>'4bet_opportunities')::INTEGER, 0),
            COALESCE((increments_data->>'4bet_actions')::INTEGER, 0),
            COALESCE((increments_data->>'fold_vs_4bet_opportunities')::INTEGER, 0),
            COALESCE((increments_data->>'fold_vs_4bet_actions')::INTEGER, 0),
            COALESCE((increments_data->>'agg_bets')::INTEGER, 0),
            COALESCE((increments_data->>'agg_raises')::INTEGER, 0),
            COALESCE((increments_data->>'agg_calls')::INTEGER, 0),
            COALESCE((increments_data->>'cbet_flop_opportunities')::INTEGER, 0),
            COALESCE((increments_data->>'cbet_flop_actions')::INTEGER, 0),
            COALESCE((increments_data->>'fold_vs_cbet_flop_opportunities')::INTEGER, 0),
            COALESCE((increments_data->>'fold_vs_cbet_flop_actions')::INTEGER, 0),
            COALESCE((increments_data->>'raise_vs_cbet_flop_opportunities')::INTEGER, 0),
            COALESCE((increments_data->>'raise_vs_cbet_flop_actions')::INTEGER, 0),
            COALESCE((increments_data->>'ch_raise_flop_opportunities')::INTEGER, 0),
            COALESCE((increments_data->>'ch_raise_flop_actions')::INTEGER, 0),
            COALESCE((increments_data->>'donk_flop_opportunities')::INTEGER, 0),
            COALESCE((increments_data->>'donk_flop_actions')::INTEGER, 0),
            COALESCE((increments_data->>'wtsd_opportunities')::INTEGER, 0),
            COALESCE((increments_data->>'wtsd_actions')::INTEGER, 0),
            COALESCE((increments_data->>'wsd_opportunities')::INTEGER, 0),
            COALESCE((increments_data->>'wsd_actions')::INTEGER, 0),
            COALESCE((increments_data->>'wwsf_opportunities')::INTEGER, 0),
            COALESCE((increments_data->>'wwsf_actions')::INTEGER, 0)
        )
        ON CONFLICT (player_id) 
        DO UPDATE SET
            hands_played = player_stats.hands_played + COALESCE((increments_data->>'hands_played')::INTEGER, 0),
            hands_won = player_stats.hands_won + COALESCE((increments_data->>'hands_won')::INTEGER, 0),
            total_bb_won = player_stats.total_bb_won + COALESCE((increments_data->>'total_bb_won')::INTEGER, 0),
            total_pot_size_won = player_stats.total_pot_size_won + COALESCE((increments_data->>'total_pot_size_won')::INTEGER, 0),
            vpip_opportunities = player_stats.vpip_opportunities + COALESCE((increments_data->>'vpip_opportunities')::INTEGER, 0),
            vpip_actions = player_stats.vpip_actions + COALESCE((increments_data->>'vpip_actions')::INTEGER, 0),
            pfr_opportunities = player_stats.pfr_opportunities + COALESCE((increments_data->>'pfr_opportunities')::INTEGER, 0),
            pfr_actions = player_stats.pfr_actions + COALESCE((increments_data->>'pfr_actions')::INTEGER, 0),
            btn_rfi_opportunities = player_stats.btn_rfi_opportunities + COALESCE((increments_data->>'btn_rfi_opportunities')::INTEGER, 0),
            btn_rfi_actions = player_stats.btn_rfi_actions + COALESCE((increments_data->>'btn_rfi_actions')::INTEGER, 0),
            threeb_opportunities = player_stats.threeb_opportunities + COALESCE((increments_data->>'3bet_opportunities')::INTEGER, 0),
            threeb_actions = player_stats.threeb_actions + COALESCE((increments_data->>'3bet_actions')::INTEGER, 0),
            fold_vs_3bet_opportunities = player_stats.fold_vs_3bet_opportunities + COALESCE((increments_data->>'fold_vs_3bet_opportunities')::INTEGER, 0),
            fold_vs_3bet_actions = player_stats.fold_vs_3bet_actions + COALESCE((increments_data->>'fold_vs_3bet_actions')::INTEGER, 0),
            fourbet_opportunities = player_stats.fourbet_opportunities + COALESCE((increments_data->>'4bet_opportunities')::INTEGER, 0),
            fourbet_actions = player_stats.fourbet_actions + COALESCE((increments_data->>'4bet_actions')::INTEGER, 0),
            fold_vs_4bet_opportunities = player_stats.fold_vs_4bet_opportunities + COALESCE((increments_data->>'fold_vs_4bet_opportunities')::INTEGER, 0),
            fold_vs_4bet_actions = player_stats.fold_vs_4bet_actions + COALESCE((increments_data->>'fold_vs_4bet_actions')::INTEGER, 0),
            agg_bets = player_stats.agg_bets + COALESCE((increments_data->>'agg_bets')::INTEGER, 0),
            agg_raises = player_stats.agg_raises + COALESCE((increments_data->>'agg_raises')::INTEGER, 0),
            agg_calls = player_stats.agg_calls + COALESCE((increments_data->>'agg_calls')::INTEGER, 0),
            cbet_flop_opportunities = player_stats.cbet_flop_opportunities + COALESCE((increments_data->>'cbet_flop_opportunities')::INTEGER, 0),
            cbet_flop_actions = player_stats.cbet_flop_actions + COALESCE((increments_data->>'cbet_flop_actions')::INTEGER, 0),
            fold_vs_cbet_flop_opportunities = player_stats.fold_vs_cbet_flop_opportunities + COALESCE((increments_data->>'fold_vs_cbet_flop_opportunities')::INTEGER, 0),
            fold_vs_cbet_flop_actions = player_stats.fold_vs_cbet_flop_actions + COALESCE((increments_data->>'fold_vs_cbet_flop_actions')::INTEGER, 0),
            raise_vs_cbet_flop_opportunities = player_stats.raise_vs_cbet_flop_opportunities + COALESCE((increments_data->>'raise_vs_cbet_flop_opportunities')::INTEGER, 0),
            raise_vs_cbet_flop_actions = player_stats.raise_vs_cbet_flop_actions + COALESCE((increments_data->>'raise_vs_cbet_flop_actions')::INTEGER, 0),
            ch_raise_flop_opportunities = player_stats.ch_raise_flop_opportunities + COALESCE((increments_data->>'ch_raise_flop_opportunities')::INTEGER, 0),
            ch_raise_flop_actions = player_stats.ch_raise_flop_actions + COALESCE((increments_data->>'ch_raise_flop_actions')::INTEGER, 0),
            donk_flop_opportunities = player_stats.donk_flop_opportunities + COALESCE((increments_data->>'donk_flop_opportunities')::INTEGER, 0),
            donk_flop_actions = player_stats.donk_flop_actions + COALESCE((increments_data->>'donk_flop_actions')::INTEGER, 0),
            wtsd_opportunities = player_stats.wtsd_opportunities + COALESCE((increments_data->>'wtsd_opportunities')::INTEGER, 0),
            wtsd_actions = player_stats.wtsd_actions + COALESCE((increments_data->>'wtsd_actions')::INTEGER, 0),
            wsd_opportunities = player_stats.wsd_opportunities + COALESCE((increments_data->>'wsd_opportunities')::INTEGER, 0),
            wsd_actions = player_stats.wsd_actions + COALESCE((increments_data->>'wsd_actions')::INTEGER, 0),
            wwsf_opportunities = player_stats.wwsf_opportunities + COALESCE((increments_data->>'wwsf_opportunities')::INTEGER, 0),
            wwsf_actions = player_stats.wwsf_actions + COALESCE((increments_data->>'wwsf_actions')::INTEGER, 0),
            updated_at = NOW();
        
        -- Handle position-specific stats
        IF position_data IS NOT NULL THEN
            -- Process each position in the position_data
            FOR pos_key IN SELECT jsonb_object_keys(position_data)
            LOOP
                pos_stats := position_data->pos_key;
                
                -- Update position-specific columns based on position name
                CASE pos_key
                    WHEN 'BTN' THEN
                        UPDATE player_stats SET
                            btn_vpip_opportunities = btn_vpip_opportunities + COALESCE((pos_stats->>'vpip_opportunities')::INTEGER, 0),
                            btn_vpip_actions = btn_vpip_actions + COALESCE((pos_stats->>'vpip_actions')::INTEGER, 0),
                            btn_pfr_opportunities = btn_pfr_opportunities + COALESCE((pos_stats->>'pfr_opportunities')::INTEGER, 0),
                            btn_pfr_actions = btn_pfr_actions + COALESCE((pos_stats->>'pfr_actions')::INTEGER, 0)
                        WHERE player_id = player_uuid;
                    WHEN 'SB' THEN
                        UPDATE player_stats SET
                            sb_vpip_opportunities = sb_vpip_opportunities + COALESCE((pos_stats->>'vpip_opportunities')::INTEGER, 0),
                            sb_vpip_actions = sb_vpip_actions + COALESCE((pos_stats->>'vpip_actions')::INTEGER, 0),
                            sb_pfr_opportunities = sb_pfr_opportunities + COALESCE((pos_stats->>'pfr_opportunities')::INTEGER, 0),
                            sb_pfr_actions = sb_pfr_actions + COALESCE((pos_stats->>'pfr_actions')::INTEGER, 0)
                        WHERE player_id = player_uuid;
                    WHEN 'BB' THEN
                        UPDATE player_stats SET
                            bb_vpip_opportunities = bb_vpip_opportunities + COALESCE((pos_stats->>'vpip_opportunities')::INTEGER, 0),
                            bb_vpip_actions = bb_vpip_actions + COALESCE((pos_stats->>'vpip_actions')::INTEGER, 0),
                            bb_pfr_opportunities = bb_pfr_opportunities + COALESCE((pos_stats->>'pfr_opportunities')::INTEGER, 0),
                            bb_pfr_actions = bb_pfr_actions + COALESCE((pos_stats->>'pfr_actions')::INTEGER, 0)
                        WHERE player_id = player_uuid;
                    WHEN 'BTN/SB' THEN
                        UPDATE player_stats SET
                            btn_sb_vpip_opportunities = btn_sb_vpip_opportunities + COALESCE((pos_stats->>'vpip_opportunities')::INTEGER, 0),
                            btn_sb_vpip_actions = btn_sb_vpip_actions + COALESCE((pos_stats->>'vpip_actions')::INTEGER, 0),
                            btn_sb_pfr_opportunities = btn_sb_pfr_opportunities + COALESCE((pos_stats->>'pfr_opportunities')::INTEGER, 0),
                            btn_sb_pfr_actions = btn_sb_pfr_actions + COALESCE((pos_stats->>'pfr_actions')::INTEGER, 0)
                        WHERE player_id = player_uuid;
                    WHEN 'UTG' THEN
                        UPDATE player_stats SET
                            utg_vpip_opportunities = utg_vpip_opportunities + COALESCE((pos_stats->>'vpip_opportunities')::INTEGER, 0),
                            utg_vpip_actions = utg_vpip_actions + COALESCE((pos_stats->>'vpip_actions')::INTEGER, 0),
                            utg_pfr_opportunities = utg_pfr_opportunities + COALESCE((pos_stats->>'pfr_opportunities')::INTEGER, 0),
                            utg_pfr_actions = utg_pfr_actions + COALESCE((pos_stats->>'pfr_actions')::INTEGER, 0)
                        WHERE player_id = player_uuid;
                    WHEN 'UTG+1' THEN
                        UPDATE player_stats SET
                            utg1_vpip_opportunities = utg1_vpip_opportunities + COALESCE((pos_stats->>'vpip_opportunities')::INTEGER, 0),
                            utg1_vpip_actions = utg1_vpip_actions + COALESCE((pos_stats->>'vpip_actions')::INTEGER, 0),
                            utg1_pfr_opportunities = utg1_pfr_opportunities + COALESCE((pos_stats->>'pfr_opportunities')::INTEGER, 0),
                            utg1_pfr_actions = utg1_pfr_actions + COALESCE((pos_stats->>'pfr_actions')::INTEGER, 0)
                        WHERE player_id = player_uuid;
                    WHEN 'MP' THEN
                        UPDATE player_stats SET
                            mp_vpip_opportunities = mp_vpip_opportunities + COALESCE((pos_stats->>'vpip_opportunities')::INTEGER, 0),
                            mp_vpip_actions = mp_vpip_actions + COALESCE((pos_stats->>'vpip_actions')::INTEGER, 0),
                            mp_pfr_opportunities = mp_pfr_opportunities + COALESCE((pos_stats->>'pfr_opportunities')::INTEGER, 0),
                            mp_pfr_actions = mp_pfr_actions + COALESCE((pos_stats->>'pfr_actions')::INTEGER, 0)
                        WHERE player_id = player_uuid;
                    WHEN 'LJ' THEN
                        UPDATE player_stats SET
                            lj_vpip_opportunities = lj_vpip_opportunities + COALESCE((pos_stats->>'vpip_opportunities')::INTEGER, 0),
                            lj_vpip_actions = lj_vpip_actions + COALESCE((pos_stats->>'vpip_actions')::INTEGER, 0),
                            lj_pfr_opportunities = lj_pfr_opportunities + COALESCE((pos_stats->>'pfr_opportunities')::INTEGER, 0),
                            lj_pfr_actions = lj_pfr_actions + COALESCE((pos_stats->>'pfr_actions')::INTEGER, 0)
                        WHERE player_id = player_uuid;
                    WHEN 'HJ' THEN
                        UPDATE player_stats SET
                            hj_vpip_opportunities = hj_vpip_opportunities + COALESCE((pos_stats->>'vpip_opportunities')::INTEGER, 0),
                            hj_vpip_actions = hj_vpip_actions + COALESCE((pos_stats->>'vpip_actions')::INTEGER, 0),
                            hj_pfr_opportunities = hj_pfr_opportunities + COALESCE((pos_stats->>'pfr_opportunities')::INTEGER, 0),
                            hj_pfr_actions = hj_pfr_actions + COALESCE((pos_stats->>'pfr_actions')::INTEGER, 0)
                        WHERE player_id = player_uuid;
                    WHEN 'CO' THEN
                        UPDATE player_stats SET
                            co_vpip_opportunities = co_vpip_opportunities + COALESCE((pos_stats->>'vpip_opportunities')::INTEGER, 0),
                            co_vpip_actions = co_vpip_actions + COALESCE((pos_stats->>'vpip_actions')::INTEGER, 0),
                            co_pfr_opportunities = co_pfr_opportunities + COALESCE((pos_stats->>'pfr_opportunities')::INTEGER, 0),
                            co_pfr_actions = co_pfr_actions + COALESCE((pos_stats->>'pfr_actions')::INTEGER, 0)
                        WHERE player_id = player_uuid;
                END CASE;
            END LOOP;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 