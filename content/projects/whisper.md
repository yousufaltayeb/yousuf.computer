+++
title = "OpenWhisper"
type = "project"
description = "A voice dictation tool for Linux using faster-whisper. Toggle recording, auto-type transcription into any window."
symbol = "~"
year = 2026
featured = true
[taxonomies]
tags = ["Python", "Whisper", "Linux", "Voice"]
[extra]
github = "https://github.com/yousufaltayeb/openwhisper"
+++

There is no working voice dictation tool for Linux. The only one I could find was soupawhisper, and it didn't work on Void Linux. So I built my own.

This is a fork of soupawhisper, rewritten to support Void Linux, Runit, and PulseAudio/PipeWire. The original used push-to-talk; I rewrote the interaction to toggle recording instead, which feels much more natural for longer dictation. Press a hotkey to start recording, press again to stop — it transcribes your speech and types it directly into the active window.

Uses faster-whisper for high-performance local inference — no cloud API, no latency, no privacy concerns. Transcribed text is copied to clipboard and auto-typed via xdotool. Desktop notifications keep you informed of recording status.
