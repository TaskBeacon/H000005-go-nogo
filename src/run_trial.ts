import {
  set_trial_context,
  type StimBank,
  type TaskSettings,
  type TrialBuilder,
  type TrialSnapshot
} from "psyflow-web";

export function run_trial(
  trial: TrialBuilder,
  condition: string,
  context: {
    settings: TaskSettings;
    stimBank: StimBank;
    block_id: string;
    block_idx: number;
  }
): TrialBuilder {
  const { settings, stimBank, block_id, block_idx } = context;
  const condition_id = String(condition);
  const key_list = ((settings.key_list as string[]) ?? ["space"]).map(String);

  const fixationUnit = trial.unit("fixation").addStim(stimBank.get("fixation"));
  set_trial_context(fixationUnit, {
    trial_id: trial.trial_id,
    phase: "pre_target_fixation",
    deadline_s: (settings.fixation_duration as number | number[] | null | undefined) ?? null,
    valid_keys: [...key_list],
    block_id,
    condition_id,
    task_factors: {
      condition: condition_id,
      stage: "pre_target_fixation",
      block_idx
    },
    stim_id: "fixation"
  });
  fixationUnit.show({ duration: (settings.fixation_duration as number | number[] | null | undefined) ?? null }).to_dict();

  const trigger_map = (settings.triggers ?? {}) as Record<string, unknown>;
  if (condition_id === "go") {
    const goUnit = trial.unit("go").addStim(stimBank.get("go"));
    set_trial_context(goUnit, {
      trial_id: trial.trial_id,
      phase: "go_response_window",
      deadline_s: Number(settings.go_duration ?? 1),
      valid_keys: [...key_list],
      block_id,
      condition_id,
      task_factors: {
        condition: condition_id,
        stage: "go_response_window",
        block_idx
      },
      stim_id: "go"
    });
    goUnit
      .captureResponse({
        keys: key_list,
        duration: Number(settings.go_duration ?? 1),
        response_trigger: Number(trigger_map.go_response ?? 11),
        timeout_trigger: Number(trigger_map.go_miss ?? 12),
        terminate_on_response: true
      })
      .to_dict();

    trial
      .unit("no_response_feedback")
      .when((snapshot: TrialSnapshot) => !Boolean(snapshot.units.go?.response))
      .addStim(stimBank.get("no_response_feedback"))
      .show({ duration: Number(settings.no_response_feedback_duration ?? 0.8) })
      .to_dict();
  } else {
    const nogoUnit = trial.unit("nogo").addStim(stimBank.get("nogo"));
    set_trial_context(nogoUnit, {
      trial_id: trial.trial_id,
      phase: "nogo_inhibition_window",
      deadline_s: Number(settings.go_duration ?? 1),
      valid_keys: [...key_list],
      block_id,
      condition_id,
      task_factors: {
        condition: condition_id,
        stage: "nogo_inhibition_window",
        block_idx
      },
      stim_id: "nogo"
    });
    nogoUnit
      .captureResponse({
        keys: key_list,
        duration: Number(settings.go_duration ?? 1),
        response_trigger: Number(trigger_map.nogo_response ?? 21),
        timeout_trigger: Number(trigger_map.nogo_miss ?? 22),
        terminate_on_response: true
      })
      .to_dict();

    trial
      .unit("nogo_error_feedback")
      .when((snapshot: TrialSnapshot) => Boolean(snapshot.units.nogo?.response))
      .addStim(stimBank.get("nogo_error_feedback"))
      .show({ duration: Number(settings.nogo_error_feedback_duration ?? 0.8) })
      .to_dict();
  }

  return trial;
}
