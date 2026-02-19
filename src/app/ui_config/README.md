# UI Config Bootstrap

This module fetches `/api/ui_config` on app load, writes the returned `NEXT_PUBLIC*` values to `window.uiConfig`, and emits `ui_config_updated` so client components can refresh runtime configuration.
