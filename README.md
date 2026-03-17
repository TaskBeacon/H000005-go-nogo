# H000005 Go/No-Go

HTML/browser preview of the Go/No-Go task built with `psyflow-web`.
The within-trial sequence, condition weighting semantics, response logic, feedback behavior, and timing model are aligned to local `T000005-go-nogo`; only block/trial counts are shortened for preview.

## Layout

- `main.ts`: task orchestration
- `config/config.yaml`: declarative config
- `src/run_trial.ts`: trial logic
- `src/utils.ts`: block summary helper

## Run

From `e:\xhmhc\TaskBeacon\psyflow-web`:

```powershell
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:4173/?task=H000005-go-nogo
```
