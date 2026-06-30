import { Types } from "mongoose";
import { AnalyticsEvent } from "../models";
import type { AnalyticsEventType } from "../types";

export function logEvent(
  type: AnalyticsEventType,
  property?: Types.ObjectId | string,
  meta?: Record<string, unknown>
): Promise<void> {
  return AnalyticsEvent.create({
    type,
    property:
      property && Types.ObjectId.isValid(String(property))
        ? new Types.ObjectId(String(property))
        : undefined,
    meta,
  })
    .then(() => undefined)
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.warn("[analytics] failed to log event:", err?.message ?? err);
    });
}
