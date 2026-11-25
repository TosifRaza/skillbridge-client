import { vi } from 'vitest';

HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
