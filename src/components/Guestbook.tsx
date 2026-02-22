import { FormEvent, useEffect, useMemo, useState } from 'react';

type GuestbookEntry = {
  id?: string;
  name: string;
  message: string;
  createdAt: string;
};

type GuestbookProps = {
  onSubmit: (payload: { name: string; message: string }) => void;
};

const GUESTBOOK_API_BASE_URL = import.meta.env.VITE_GUESTBOOK_API_BASE_URL;
const GUESTBOOK_ADMIN_ID = import.meta.env.VITE_GUESTBOOK_ADMIN_ID;
const OWNED_ENTRY_IDS_KEY = 'dol-invite-owned-guestbook-ids';
const VIEWER_ID_KEY = 'dol-invite-viewer-id';

type OwnedEntriesMap = Record<string, true>;

function Guestbook({ onSubmit }: GuestbookProps) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [viewerId, setViewerId] = useState(() => window.localStorage.getItem(VIEWER_ID_KEY) ?? '');
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackTone, setFeedbackTone] = useState<'success' | 'error' | null>(null);
  const [ownedEntriesMap, setOwnedEntriesMap] = useState<OwnedEntriesMap>(() => {
    try {
      const raw = window.localStorage.getItem(OWNED_ENTRY_IDS_KEY);
      if (!raw) {
        return {};
      }

      const parsed = JSON.parse(raw) as unknown;
      if (typeof parsed !== 'object' || parsed === null) {
        return {};
      }

      const nextMap: OwnedEntriesMap = {};
      Object.entries(parsed).forEach(([id, isOwned]) => {
        if (typeof id === 'string' && isOwned === true) {
          nextMap[id] = true;
        }
      });

      return nextMap;
    } catch {
      return {};
    }
  });
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState('');

  const apiBaseUrl = useMemo(() => GUESTBOOK_API_BASE_URL?.trim().replace(/\/+$/, '') ?? '', []);
  const isApiConfigured = useMemo(() => Boolean(apiBaseUrl), [apiBaseUrl]);
  const isAdminViewer = useMemo(
    () => Boolean(GUESTBOOK_ADMIN_ID) && viewerId.trim() === GUESTBOOK_ADMIN_ID,
    [viewerId],
  );

  useEffect(() => {
    window.localStorage.setItem(OWNED_ENTRY_IDS_KEY, JSON.stringify(ownedEntriesMap));
  }, [ownedEntriesMap]);

  useEffect(() => {
    window.localStorage.setItem(VIEWER_ID_KEY, viewerId);
  }, [viewerId]);

  const setErrorFeedback = (messageText: string) => {
    setFeedbackTone('error');
    setFeedbackMessage(messageText);
  };

  const setSuccessFeedback = (messageText: string) => {
    setFeedbackTone('success');
    setFeedbackMessage(messageText);
  };

  const parseErrorMessage = async (response: Response, fallback: string) => {
    try {
      const parsed = (await response.json()) as { error?: string };
      if (typeof parsed.error === 'string' && parsed.error.length > 0) {
        return `${fallback} (${parsed.error})`;
      }
    } catch {
      return fallback;
    }

    return fallback;
  };

  const loadEntries = async () => {
    if (!isApiConfigured) {
      setEntries([]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/guestbook`);
      if (!response.ok) {
        throw new Error(await parseErrorMessage(response, '방명록을 불러오지 못했습니다'));
      }

      const data: unknown = await response.json();
      if (!Array.isArray(data)) {
        setEntries([]);
        return;
      }

      const validEntries = data.filter(
        (entry): entry is GuestbookEntry =>
          typeof entry === 'object' &&
          entry !== null &&
          typeof (entry as GuestbookEntry).name === 'string' &&
          typeof (entry as GuestbookEntry).message === 'string' &&
          typeof (entry as GuestbookEntry).createdAt === 'string',
      );

      setEntries(validEntries);
    } catch {
      setEntries([]);
      setErrorFeedback('방명록 서버에 연결할 수 없습니다. API 주소/서버 상태를 확인해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadEntries();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    const trimmedViewerId = viewerId.trim();

    if (!isApiConfigured) {
      setErrorFeedback('API 주소가 설정되지 않아 저장할 수 없습니다.');
      return;
    }

    if (!trimmedViewerId) {
      setErrorFeedback('사용자 ID를 입력해 주세요.');
      return;
    }

    if (!trimmedName || !trimmedMessage) {
      setErrorFeedback('이름과 메시지를 모두 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    setFeedbackMessage(null);
    setFeedbackTone(null);

    try {
      const response = await fetch(`${apiBaseUrl}/guestbook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-viewer-id': trimmedViewerId,
        },
        body: JSON.stringify({
          name: trimmedName,
          message: trimmedMessage,
          viewerId: trimmedViewerId,
        }),
      });

      if (!response.ok) {
        throw new Error(await parseErrorMessage(response, '방명록 저장에 실패했습니다'));
      }

      const created = (await response.json()) as Partial<GuestbookEntry> | null;
      if (created?.id && typeof created.id === 'string') {
        const createdId = created.id;
        setOwnedEntriesMap((prev) => ({ ...prev, [createdId]: true }));
      }

      await loadEntries();
      onSubmit({ name: trimmedName, message: trimmedMessage });
      setName('');
      setMessage('');
      setSuccessFeedback('방명록이 등록되었습니다.');
    } catch (error) {
      setErrorFeedback(error instanceof Error ? error.message : '방명록 저장에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (entryId: string) => {
    if (!isApiConfigured) {
      setErrorFeedback('API 주소가 설정되지 않아 삭제할 수 없습니다.');
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/guestbook/${entryId}`, {
        method: 'DELETE',
        headers: {
          'x-viewer-id': viewerId.trim(),
        },
      });

      if (!response.ok) {
        throw new Error(await parseErrorMessage(response, '삭제에 실패했습니다'));
      }

      setOwnedEntriesMap((prev) => {
        const next = { ...prev };
        delete next[entryId];
        return next;
      });
      setEditingEntryId((prev) => (prev === entryId ? null : prev));
      await loadEntries();
      setSuccessFeedback('방명록을 삭제했습니다.');
    } catch (error) {
      setErrorFeedback(error instanceof Error ? error.message : '삭제에 실패했습니다.');
    }
  };

  const startEditing = (entry: GuestbookEntry) => {
    if (!entry.id) {
      return;
    }

    setEditingEntryId(entry.id);
    setEditingMessage(entry.message);
  };

  const handleEditSave = async (entryId: string) => {
    const trimmed = editingMessage.trim();
    if (!trimmed || !isApiConfigured) {
      setErrorFeedback('수정할 내용을 입력해 주세요.');
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/guestbook/${entryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-viewer-id': viewerId.trim(),
        },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!response.ok) {
        throw new Error(await parseErrorMessage(response, '수정에 실패했습니다'));
      }

      setEditingEntryId(null);
      setEditingMessage('');
      await loadEntries();
      setSuccessFeedback('방명록을 수정했습니다.');
    } catch (error) {
      setErrorFeedback(error instanceof Error ? error.message : '수정에 실패했습니다.');
    }
  };

  return (
    <section className="invitation-card animate-rise" style={{ animationDelay: '0.12s' }}>
      <h2 className="section-title">방명록</h2>

      {!isApiConfigured ? (
        <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          공유 방명록을 사용하려면 <code>VITE_GUESTBOOK_API_BASE_URL</code> 환경 변수를 설정해 주세요.
        </p>
      ) : null}

      {feedbackMessage ? (
        <p
          className={`mt-3 rounded-xl border px-3 py-2 text-xs ${
            feedbackTone === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : 'border-amber-200 bg-amber-50 text-amber-900'
          }`}
        >
          {feedbackMessage}
        </p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <label className="block text-sm text-rosewood/90">
          사용자 ID
          <input
            className="mt-1 w-full rounded-xl border border-rosewood/20 bg-white px-3 py-2 text-sm"
            value={viewerId}
            onChange={(event) => setViewerId(event.target.value)}
            placeholder="본인 식별 ID를 입력해 주세요"
            required
          />
        </label>

        <label className="block text-sm text-rosewood/90">
          이름
          <input
            className="mt-1 w-full rounded-xl border border-rosewood/20 bg-white px-3 py-2 text-sm"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="성함을 입력해 주세요"
            required
          />
        </label>

        <label className="block text-sm text-rosewood/90">
          메시지
          <textarea
            className="mt-1 min-h-24 w-full rounded-xl border border-rosewood/20 bg-white px-3 py-2 text-sm"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="축하 메시지를 남겨주세요"
            required
          />
        </label>

        <button
          type="submit"
          disabled={!isApiConfigured || isSubmitting}
          className="w-full rounded-full bg-rosewood py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? '등록 중...' : '방명록 남기기'}
        </button>
      </form>

      {isLoading ? <p className="mt-4 text-sm text-rosewood/70">불러오는 중...</p> : null}

      {entries.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {entries.map((entry, index) => {
            const entryId = entry.id ?? `${entry.createdAt}-${entry.name}-${index}`;
            const entryIdValue = entry.id;
            const isOwned = entryIdValue ? ownedEntriesMap[entryIdValue] === true : false;
            const canManage = isOwned || isAdminViewer;
            const isEditing = entryIdValue ? editingEntryId === entryIdValue : false;

            return (
              <li key={entryId} className="rounded-xl border border-rosewood/15 bg-white/70 p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-rosewood">{entry.name}</p>
                  {canManage && entryIdValue ? (
                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            className="text-xs font-medium text-rosewood/80"
                            onClick={() => handleEditSave(entryIdValue)}
                          >
                            저장
                          </button>
                          <button
                            type="button"
                            className="text-xs font-medium text-rosewood/60"
                            onClick={() => {
                              setEditingEntryId(null);
                              setEditingMessage('');
                            }}
                          >
                            취소
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="text-xs font-medium text-rosewood/80"
                            onClick={() => startEditing(entry)}
                          >
                            수정
                          </button>
                          <button
                            type="button"
                            className="text-xs font-medium text-rosewood/60"
                            onClick={() => handleDelete(entryIdValue)}
                          >
                            삭제
                          </button>
                        </>
                      )}
                    </div>
                  ) : null}
                </div>

                {isEditing ? (
                  <textarea
                    className="mt-2 min-h-20 w-full rounded-xl border border-rosewood/20 bg-white px-3 py-2 text-sm"
                    value={editingMessage}
                    onChange={(event) => setEditingMessage(event.target.value)}
                  />
                ) : (
                  <p className="mt-1 whitespace-pre-line text-sm text-rosewood/90">{entry.message}</p>
                )}

                <p className="mt-1 text-xs text-rosewood/60">{entry.createdAt}</p>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}

export default Guestbook;
