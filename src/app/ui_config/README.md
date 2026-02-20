# UI Config Gate

This module gates app rendering until `/api/ui_config` is loaded. It writes the returned `NEXT_PUBLIC*` values to `window.uiConfig`, applies favicon URLs from `NEXT_PUBLIC_ASSETS_BASE_URL`, emits `ui_config_updated`, and only then renders page content.
