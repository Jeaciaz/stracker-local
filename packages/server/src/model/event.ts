import {z} from 'zod'
import {Spending, SpendingCreate} from './spending'

const EventType = z.union([
  z.literal('AddSpending'),
  z.literal('EditSpending'),
  z.literal('RemoveSpending'),
])

export type EventType = z.infer<typeof EventType>

const BaseEvent = z.object({id: z.string(), timestamp: z.number()})

const EventAddSpending = BaseEvent.extend({
  type: z.literal('AddSpending'),
  eventData: SpendingCreate,
})
const EventEditSpending = BaseEvent.extend({
  type: z.literal('EditSpending'),
  eventData: Spending,
})
const EventRemoveSpending = BaseEvent.extend({
  type: z.literal('RemoveSpending'),
  eventData: Spending.pick({id: true}),
})

export const Event = z.discriminatedUnion('type', [
  EventAddSpending,
  EventEditSpending,
  EventRemoveSpending,
])

export type Event =
  Exclude<EventType, z.infer<typeof Event>['type']> extends never
    ? z.infer<typeof Event>
    : "Event schema doesn't cover all event types!"

export const EventCreate = z.discriminatedUnion('type', [
  EventAddSpending.omit({id: true}),
  EventEditSpending.omit({id: true}),
  EventRemoveSpending.omit({id: true}),
])

export type EventCreate = z.infer<typeof EventCreate>

export const EventFilters = z.object({
  timestampFrom: z.number().optional(),
})

export type EventFilters = z.infer<typeof EventFilters>

// If forgot to add event type to schema, this will error
// @ts-expect-error
const _TYPE_CHECK: Event =
  "Event schema doesn't cover all event types!" as const
