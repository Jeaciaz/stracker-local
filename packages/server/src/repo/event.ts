import {z} from 'zod'
import {turso} from '../db'
import {Event, EventFilters, type EventCreate} from '../model/event'
import type {Repo} from './repo'
import {ulid} from 'ulid'
import {createSpendingRepo, SPENDINGS_TABLE_NAME} from './spending'
import {Spending} from '../model/spending'

export const EVENTS_TABLE_NAME = 'spendingEvents'
const COL_NAMES = ['id', 'type', 'timestamp', 'spendingId'] as const

const genId = () => `ev_${ulid()}`

const createMultiple = async (eventsCreate: EventCreate[]) => {
  if (eventsCreate.length === 0) return []
  const transaction = await turso.transaction()
  const spendingRepo = createSpendingRepo(transaction)

  const events = (await Promise.all(
    eventsCreate.map(create => {
      switch (create.type) {
        case 'AddSpending':
          return spendingRepo.create(create.eventData).then(id => ({
            id: genId(),
            type: create.type,
            timestamp: create.timestamp,
            spendingId: id,
          }))
        case 'EditSpending':
        case 'RemoveSpending':
          return {
            id: genId(),
            type: create.type,
            timestamp: create.timestamp,
            spendingId: create.eventData.id,
          }
      }
    }),
  )) satisfies {}[]

  const vars = events
    .map(() => `(${COL_NAMES.map(() => '?').join(', ')})`)
    .join(', ')
  const values = events.flatMap(e => COL_NAMES.map(col => e[col]))

  await transaction.execute({
    sql: `INSERT INTO ${EVENTS_TABLE_NAME} (${COL_NAMES}) VALUES ${vars}`,
    args: values,
  })
  await transaction.commit()

  return events.map(e => e.id)
}

const getList = (filters?: EventFilters) =>
  turso
    .execute({
      sql: `SELECT *, ${SPENDINGS_TABLE_NAME}.id as spendingId FROM ${EVENTS_TABLE_NAME} INNER JOIN ${SPENDINGS_TABLE_NAME} ON spendingId = ${SPENDINGS_TABLE_NAME}.id WHERE ${EVENTS_TABLE_NAME}.timestamp > ?`,
      args: [filters?.timestampFrom ?? 0],
    })
    .then(({rows}) =>
      rows.map(row => ({
        ...row,
        eventData: Spending.parse({...row, id: row.spendingId}),
      })),
    )
    .then(rows => z.array(Event).parse(rows))

export const eventRepo = {getList, createMultiple} satisfies Partial<
  Repo<Event, EventCreate, EventFilters>
>
