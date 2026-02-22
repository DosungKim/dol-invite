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

function Guestbook({ onSubmit }: GuestbookProps) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isApiConfigured = useMemo(() => Boolean(GUESTBOOK_API_BASE_URL), []);

  const loadEntries = async () => {
    if (!isApiConfigured) {
      setEntries([]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${GUESTBOOK_API_BASE_URL}/guestbook`);
      if (!response.ok) {
        throw new Error('failed to fetch guestbook entries');
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
    if (!trimmedName || !trimmedMessage || !isApiConfigured) {
      return;
    }

    try {
      const response = await fetch(`${GUESTBOOK_API_BASE_URL}/guestbook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: trimmedName,
          message: trimmedMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('failed to save guestbook entry');
      }

      await loadEntries();
      onSubmit({ name: trimmedName, message: trimmedMessage });
      setName('');
      setMessage('');
    } catch {
      // 실패 시 조용히 유지
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

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
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
          disabled={!isApiConfigured}
          className="w-full rounded-full bg-rosewood py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          방명록 남기기
        </button>
      </form>

      {isLoading ? <p className="mt-4 text-sm text-rosewood/70">불러오는 중...</p> : null}

      {entries.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {entries.map((entry, index) => (
            <li
              key={entry.id ?? `${entry.createdAt}-${entry.name}-${index}`}
              className="rounded-xl border border-rosewood/15 bg-white/70 p-3"
            >
              <p className="text-sm font-medium text-rosewood">{entry.name}</p>
              <p className="mt-1 whitespace-pre-line text-sm text-rosewood/90">{entry.message}</p>
              <p className="mt-1 text-xs text-rosewood/60">{entry.createdAt}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export default Guestbook;
