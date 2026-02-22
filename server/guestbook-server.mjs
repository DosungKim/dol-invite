import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';

const PORT = Number(process.env.PORT ?? 4000);
const DATA_FILE = resolve(process.cwd(), process.env.GUESTBOOK_DATA_FILE ?? 'data/guestbook.json');
const ADMIN_ID = process.env.GUESTBOOK_ADMIN_ID ?? process.env.VITE_GUESTBOOK_ADMIN_ID ?? '';

const CORS_ALLOW_ORIGIN = process.env.CORS_ALLOW_ORIGIN ?? '*';

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': CORS_ALLOW_ORIGIN,
    'Access-Control-Allow-Headers': 'Content-Type, x-viewer-id',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
  });
  res.end(JSON.stringify(payload));
};

const parseJsonBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return null;
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf-8'));
  } catch {
    return undefined;
  }
};

const ensureDataFile = async () => {
  await mkdir(dirname(DATA_FILE), { recursive: true });
  try {
    await readFile(DATA_FILE, 'utf-8');
  } catch {
    await writeFile(DATA_FILE, '[]\n', 'utf-8');
  }
};

const loadEntries = async () => {
  await ensureDataFile();
  const raw = await readFile(DATA_FILE, 'utf-8');

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (entry) =>
        entry &&
        typeof entry.id === 'string' &&
        typeof entry.name === 'string' &&
        typeof entry.message === 'string' &&
        typeof entry.createdAt === 'string' &&
        typeof entry.viewerId === 'string',
    );
  } catch {
    return [];
  }
};

const saveEntries = async (entries) => {
  await ensureDataFile();
  await writeFile(DATA_FILE, `${JSON.stringify(entries, null, 2)}\n`, 'utf-8');
};

const toPublicEntry = (entry) => ({
  id: entry.id,
  name: entry.name,
  message: entry.message,
  createdAt: entry.createdAt,
});

const isOwnerOrAdmin = (entry, viewerId) => Boolean(viewerId) && (entry.viewerId === viewerId || (ADMIN_ID && viewerId === ADMIN_ID));

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
  const pathname = url.pathname;

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': CORS_ALLOW_ORIGIN,
      'Access-Control-Allow-Headers': 'Content-Type, x-viewer-id',
      'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    });
    res.end();
    return;
  }

  if (req.method === 'GET' && pathname === '/guestbook') {
    const entries = await loadEntries();
    sendJson(res, 200, entries.map(toPublicEntry).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)));
    return;
  }

  if (req.method === 'POST' && pathname === '/guestbook') {
    const body = await parseJsonBody(req);
    if (body === undefined) {
      sendJson(res, 400, { error: 'invalid_json' });
      return;
    }

    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    const viewerIdFromBody = typeof body?.viewerId === 'string' ? body.viewerId.trim() : '';
    const viewerIdFromHeader = typeof req.headers['x-viewer-id'] === 'string' ? req.headers['x-viewer-id'].trim() : '';

    if (!name || !message || !viewerIdFromBody || !viewerIdFromHeader || viewerIdFromBody !== viewerIdFromHeader) {
      sendJson(res, 400, { error: 'invalid_payload' });
      return;
    }

    const nextEntry = {
      id: randomUUID(),
      name,
      message,
      createdAt: new Date().toISOString(),
      viewerId: viewerIdFromBody,
    };

    const entries = await loadEntries();
    entries.push(nextEntry);
    await saveEntries(entries);
    sendJson(res, 201, toPublicEntry(nextEntry));
    return;
  }

  const match = pathname.match(/^\/guestbook\/([^/]+)$/);
  if (match && (req.method === 'PATCH' || req.method === 'DELETE')) {
    const viewerId = typeof req.headers['x-viewer-id'] === 'string' ? req.headers['x-viewer-id'].trim() : '';
    if (!viewerId) {
      sendJson(res, 401, { error: 'viewer_id_required' });
      return;
    }

    const entryId = decodeURIComponent(match[1]);
    const entries = await loadEntries();
    const targetIndex = entries.findIndex((entry) => entry.id === entryId);

    if (targetIndex < 0) {
      sendJson(res, 404, { error: 'entry_not_found' });
      return;
    }

    if (!isOwnerOrAdmin(entries[targetIndex], viewerId)) {
      sendJson(res, 403, { error: 'forbidden' });
      return;
    }

    if (req.method === 'DELETE') {
      entries.splice(targetIndex, 1);
      await saveEntries(entries);
      sendJson(res, 200, { ok: true });
      return;
    }

    const body = await parseJsonBody(req);
    if (body === undefined) {
      sendJson(res, 400, { error: 'invalid_json' });
      return;
    }

    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    if (!message) {
      sendJson(res, 400, { error: 'invalid_payload' });
      return;
    }

    entries[targetIndex] = {
      ...entries[targetIndex],
      message,
    };

    await saveEntries(entries);
    sendJson(res, 200, toPublicEntry(entries[targetIndex]));
    return;
  }

  sendJson(res, 404, { error: 'not_found' });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Guestbook API listening on http://0.0.0.0:${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`Data file: ${DATA_FILE}`);
  if (ADMIN_ID) {
    // eslint-disable-next-line no-console
    console.log('Admin ID is configured.');
  }
});
