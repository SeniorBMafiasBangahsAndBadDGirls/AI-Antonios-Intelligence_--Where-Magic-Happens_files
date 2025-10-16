// Moved from inline module in index.html
// This module initializes app logic (camera, UI handlers, Firebase interactions)

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore, doc, setDoc, onSnapshot, collection, addDoc, serverTimestamp, query, orderBy, setLogLevel } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-storage.js";

// NOTE: This file intentionally mirrors the inline module content. It expects window.firebaseConfig to be available.

// Focused app module: camera wiring and help UI
const APP_ID = 'ai-antonios-intelligence';
let localStream = null;
let audioStream = null;

const db = window.db || null;
const auth = window.auth || null;

function showMessage(message) {
    const el = document.getElementById('message-text');
    if (el) {
        el.textContent = message;
        document.getElementById('message-box').style.display = 'block';
    } else {
        alert(message);
    }
}

async function startCamera() {
    const promptMessage = document.getElementById('prompt-message');
    const statusText = document.getElementById('camera-status-text');
    const retryBtn = document.getElementById('camera-retry-btn');
    const localVideo = document.getElementById('localVideo');

    if (promptMessage) promptMessage.textContent = 'Attempting to connect to camera...';
    if (statusText) statusText.textContent = 'Camera status: connecting...';
    if (retryBtn) retryBtn.classList.add('hidden');

    if (localStream) {
        try { localStream.getTracks().forEach(t => t.stop()); } catch(e) { console.warn('stop previous stream', e); }
        localStream = null;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
        localStream = stream;
        if (localVideo) {
            localVideo.srcObject = stream;
            try { await localVideo.play(); } catch (_) { /* autoplay prevented */ }
        }
        if (promptMessage) promptMessage.textContent = 'Camera connected successfully!';
        if (statusText) statusText.textContent = 'Camera status: connected';
        if (retryBtn) retryBtn.classList.add('hidden');
    } catch (err) {
        console.error('startCamera error', err);
        let errorMessage = 'Could not access your camera. Please check your browser permissions.';
        if (err && (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')) {
            errorMessage = 'Camera access was denied. Please allow camera access in your browser settings.';
            if (promptMessage) promptMessage.textContent = 'Camera access denied. Please check your browser settings.';
        } else if (err && (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError')) {
            errorMessage = 'No camera was found on your device.';
            if (promptMessage) promptMessage.textContent = 'No camera detected.';
        } else if (err && (err.name === 'NotReadableError' || (err.message && err.message.toLowerCase().includes('device in use')))) {
            errorMessage = 'Camera may be in use by another application. Close other apps and try again.';
            if (promptMessage) promptMessage.textContent = 'Camera in use by another app.';
        }

        if (statusText) statusText.textContent = `Camera status: error - ${errorMessage}`;
        if (retryBtn) { retryBtn.classList.remove('hidden'); retryBtn.disabled = false; retryBtn.textContent = 'Retry Camera'; }
            showMessage(errorMessage);

            // Auto-open help panel and log error details to debug panel for easier diagnosis
            try {
                if (helpPanel) { helpPanel.classList.remove('hidden'); helpPanel.setAttribute('aria-hidden', 'false'); }
                const dbgEl = document.getElementById('camera-debug-panel');
                if (dbgEl) {
                    const details = document.createElement('div');
                    details.style.marginTop = '0.5rem';
                    details.style.fontSize = '12px';
                    details.textContent = `Error: ${err?.name || 'Unknown'} - ${err?.message || ''}`;
                    dbgEl.appendChild(details);
                }
            } catch (e) { console.debug('Could not auto-open help panel', e); }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const enableCam = document.getElementById('enable-camera-btn');
    if (enableCam) {
        enableCam.addEventListener('click', async () => {
            enableCam.disabled = true; enableCam.textContent = 'Connecting...';
            await startCamera();
            enableCam.style.display = 'none';
        });
    }

    const retryBtn = document.getElementById('camera-retry-btn');
    if (retryBtn) {
        retryBtn.addEventListener('click', async () => {
            retryBtn.disabled = true; retryBtn.textContent = 'Retrying...';
            await startCamera();
        });
    }

    // Help panel toggle
    const helpToggle = document.getElementById('camera-help-toggle');
    const helpPanel = document.getElementById('camera-help-panel');
    const helpClose = document.getElementById('camera-help-close');
    if (helpToggle && helpPanel) {
        helpToggle.addEventListener('click', () => { helpPanel.classList.toggle('hidden'); helpPanel.setAttribute('aria-hidden', helpPanel.classList.contains('hidden')); });
    }
    if (helpClose && helpPanel) {
        helpClose.addEventListener('click', () => { helpPanel.classList.add('hidden'); helpPanel.setAttribute('aria-hidden', 'true'); });
    }

        // Edge-specific assistance: inject block into help panel when running in Edge on Windows
        try {
            const ua = navigator.userAgent || '';
            const isEdge = /Edg\//.test(ua);
            const isWindows = /Windows NT/.test(ua);
            if (isEdge && isWindows && helpPanel) {
                const edgeBlock = document.createElement('div');
                edgeBlock.id = 'edge-help';
                edgeBlock.className = 'mt-3 p-3 bg-gray-900/60 rounded';
                edgeBlock.innerHTML = `
                    <h5 class="font-semibold">Microsoft Edge (Windows) — Quick steps</h5>
                    <p class="text-sm mt-2">On Windows 11 (no TPM) Edge may still run but system privacy settings can block camera. Try these:</p>
                    <ol class="text-sm mt-2" style="line-height:1.4;padding-left:1rem">
                        <li>Click the lock icon in the address bar → Camera → Allow for this site.</li>
                        <li>Open Windows Settings → Privacy & security → Camera → Ensure apps are allowed to use camera.</li>
                        <li>Close apps like Teams/Zoom that might hold the camera, then retry.</li>
                    </ol>
                    <div class="mt-3 flex gap-2">
                        <button id="edge-copy-steps" class="bg-yellow-400 text-black font-bold py-1 px-2 rounded">Copy Steps</button>
                        <button id="edge-open-settings" class="bg-lime-500 text-black font-bold py-1 px-2 rounded">Open Camera Settings</button>
                    </div>
                `;
                helpPanel.appendChild(edgeBlock);

                // Wire actions
                const copyBtn = edgeBlock.querySelector('#edge-copy-steps');
                const openBtn = edgeBlock.querySelector('#edge-open-settings');
                if (copyBtn) {
                    copyBtn.addEventListener('click', async () => {
                        const text = `1) Click lock icon → Camera → Allow for this site.\n2) Settings → Privacy & security → Camera → Allow apps to access camera.\n3) Close other apps (Teams/Zoom).\n4) Retry.`;
                        try { await navigator.clipboard.writeText(text); showMessage('Steps copied to clipboard.'); } catch (e) { showMessage('Unable to copy — please select and copy manually.'); }
                    });
                }
                if (openBtn) {
                    openBtn.addEventListener('click', () => {
                        // Try to open Windows Settings URI; browsers may block this, so fall back to instructing the user
                        try {
                            window.location.href = 'ms-settings:privacy-webcam';
                        } catch (e) {
                            showMessage('Could not open Settings automatically. Please open Windows Settings → Privacy & security → Camera.');
                        }
                    });
                }
            }
        } catch (e) {
            console.debug('Edge helper injection failed', e);
        }

            // --- Debug panel for diagnostics (userAgent, platform, permissions, devices) ---
            try {
                const dbg = document.createElement('div');
                dbg.id = 'camera-debug-panel';
                dbg.style.position = 'fixed';
                dbg.style.right = '1rem';
                dbg.style.bottom = '1rem';
                dbg.style.zIndex = '9999';
                dbg.style.background = 'rgba(20,20,20,0.85)';
                dbg.style.color = '#fff';
                dbg.style.padding = '0.5rem';
                dbg.style.borderRadius = '0.5rem';
                dbg.style.maxWidth = '320px';
                dbg.style.fontSize = '12px';
                dbg.innerHTML = `
                    <div style="font-weight:600;margin-bottom:0.25rem">Camera Debug</div>
                    <div id="dbg-ua">UA: ${navigator.userAgent}</div>
                    <div id="dbg-platform">Platform: ${navigator.platform || 'unknown'}</div>
                    <div id="dbg-perms">Permissions: <span id="dbg-perms-val">loading...</span></div>
                    <div id="dbg-devices" style="max-height:140px;overflow:auto;margin-top:0.5rem"></div>
                    <div style="display:flex;gap:0.5rem;margin-top:0.5rem">
                        <button id="dbg-refresh" style="flex:1;padding:6px;background:#ffc107;border:none;border-radius:4px;cursor:pointer">Refresh</button>
                        <button id="dbg-copy" style="flex:1;padding:6px;background:#4ade80;border:none;border-radius:4px;cursor:pointer">Copy</button>
                    </div>
                `;

                document.body.appendChild(dbg);

                async function refreshDiagnostics() {
                    const permsEl = document.getElementById('dbg-perms-val');
                    const devicesEl = document.getElementById('dbg-devices');
                    permsEl.textContent = 'checking...';
                    devicesEl.textContent = 'enumerating devices...';

                    // Permissions: camera and microphone (may be 'prompt'/'granted'/'denied')
                    try {
                        const cam = await navigator.permissions.query({ name: 'camera' }).catch(() => null);
                        const mic = await navigator.permissions.query({ name: 'microphone' }).catch(() => null);
                        const camState = cam?.state || 'unknown';
                        const micState = mic?.state || 'unknown';
                        permsEl.textContent = `camera: ${camState}, mic: ${micState}`;
                    } catch (e) {
                        permsEl.textContent = 'permissions API not available';
                    }

                    try {
                        const list = await navigator.mediaDevices.enumerateDevices();
                        devicesEl.innerHTML = '';
                        list.forEach(d => {
                            const el = document.createElement('div');
                            el.textContent = `${d.kind} — ${d.label || 'label-hidden'} — id:${d.deviceId}`;
                            devicesEl.appendChild(el);
                        });
                    } catch (e) {
                        devicesEl.textContent = 'enumerateDevices error: ' + (e.message || e);
                    }
                }

                document.getElementById('dbg-refresh').addEventListener('click', refreshDiagnostics);
                document.getElementById('dbg-copy').addEventListener('click', async () => {
                    // Build report
                    let report = `UA: ${navigator.userAgent}\nPlatform: ${navigator.platform}\n`;
                    try {
                        const cam = await navigator.permissions.query({ name: 'camera' }).catch(() => null);
                        const mic = await navigator.permissions.query({ name: 'microphone' }).catch(() => null);
                        report += `Permissions: camera=${cam?.state||'unknown'}, mic=${mic?.state||'unknown'}\n`;
                    } catch (e) {
                        report += 'Permissions: N/A\n';
                    }
                    try {
                        const list = await navigator.mediaDevices.enumerateDevices();
                        report += 'Devices:\n';
                        list.forEach(d => { report += `  ${d.kind} - ${d.label||'hidden'} - id:${d.deviceId}\n`; });
                    } catch (e) {
                        report += 'Devices: enumerateDevices failed\n';
                    }
                    try { await navigator.clipboard.writeText(report); showMessage('Diagnostics copied to clipboard'); } catch (e) { showMessage('Could not copy diagnostics'); }
                });

                // Initial populate
                refreshDiagnostics().catch(() => {});
            } catch (e) {
                console.debug('Debug panel injection failed', e);
            }

    // Ensure message box close works
    const closeMsg = document.getElementById('close-message');
    if (closeMsg) closeMsg.addEventListener('click', () => { document.getElementById('message-box').style.display = 'none'; });

    // Release streams on unload
    window.addEventListener('beforeunload', () => {
        if (localStream) { try { localStream.getTracks().forEach(t => t.stop()); } catch(e){} }
        if (audioStream) { try { audioStream.getTracks().forEach(t => t.stop()); } catch(e){} }
    });

    console.log('camera wiring loaded');
});
