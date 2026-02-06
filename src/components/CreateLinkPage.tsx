import { useEffect, useRef, useState, type ChangeEvent } from "react";
import type { NewLinkPayload, Platform } from "../types";

export type CreateLinkPageProps = {
  newLink: NewLinkPayload;
  note: string;
  onChange: (update: Partial<NewLinkPayload>) => void;
  onSubmit: () => void;
  onBackToAds: () => void;
};

const PLATFORM_DOMAINS: Record<Platform, string[]> = {
  Instagram: ["instagram.com"],
  TikTok: ["tiktok.com"],
  LinkedIn: ["linkedin.com"],
  Facebook: ["facebook.com", "fb.com"],
  X: ["x.com", "twitter.com"],
};

function getHost(raw: string) {
  const whatWeCheck = raw.trim();
  if (!whatWeCheck) return null;
  try {
    const url = whatWeCheck.startsWith("http")
      ? whatWeCheck
      : `https://${whatWeCheck}`;
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

/**
 * Form surface to add a new content link and trigger AI ad generation.
 */
export function CreateLinkPage({
  newLink,
  note,
  onChange,
  onSubmit,
  onBackToAds,
}: CreateLinkPageProps) {
  const [showUrlError, setShowUrlError] = useState(false);
  const urlTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  const clearUrlTimer = () => {
    if (urlTimerRef.current) window.clearTimeout(urlTimerRef.current);
    urlTimerRef.current = null;
  };

  const armUrlTimer = () => {
    clearUrlTimer();
    urlTimerRef.current = window.setTimeout(() => {
      setShowUrlError(true);
    }, 3000);
  };

  useEffect(() => clearUrlTimer, []);

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === "url") {
      setShowUrlError(false);
      armUrlTimer();
    }

    onChange({ [name]: value });
  };

  const handleUrlBlur = () => {
    clearUrlTimer();
    setShowUrlError(true);
  };

  const handlePlatform = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange({ platform: event.target.value as Platform });
  };

  const host = getHost(newLink.url);

  const invalidUrl = !!newLink.url.trim() && !host;

  const mismatch =
    !!newLink.url.trim() &&
    !!host &&
    !PLATFORM_DOMAINS[newLink.platform].some(
      (d) => host === d || host.endsWith(`.${d}`)
    );

  const canSubmit =
    !!newLink.title.trim() && !!newLink.url.trim() && !invalidUrl && !mismatch;

  const handleSubmit = () => {
    if (!canSubmit) {
      setShowUrlError(true);
      return;
    }
    onSubmit();
  };

  return (
    <div className="content">
      <header className="header compact">
        <div>
          <p className="eyebrow">New content</p>
          <h1>Generate AI ads from a link</h1>
          <p className="muted">
            Drop a social post or landing page to start tracking new ads.
          </p>
        </div>
      </header>
      <div className="panel">
        <div className="form-grid">
          <label className="field">
            <span>Title</span>
            <input
              name="title"
              value={newLink.title}
              onChange={handleInput}
              placeholder="e.g., February drop teaser"
            />
          </label>
          <label className="field">
            <span>Platform</span>
            <select
              name="platform"
              value={newLink.platform}
              onChange={handlePlatform}
            >
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Facebook">Facebook</option>
              <option value="X">X</option>
            </select>
          </label>
          <label className="field url-field">
            <span>URL</span>
            <input
              name="url"
              value={newLink.url}
              onChange={handleInput}
              placeholder="https://..."
              onBlur={handleUrlBlur}
            />
          </label>
        </div>
        {showUrlError && invalidUrl && (
          <div className="note note-error">URL incorrect</div>
        )}

        {showUrlError && mismatch && (
          <div className="note note-error">
            URL domain <b>{host}</b> does not match with platform{" "}
            <b>{newLink.platform}</b>
          </div>
        )}
        <div className="actions-row">
          <button
            className="primary"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            Add link and launch ads
          </button>
          <button className="ghost" onClick={onBackToAds}>
            Back to ads
          </button>
        </div>
        {note && <div className="note">{note}</div>}
      </div>
    </div>
  );
}
