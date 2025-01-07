import {z} from 'zod'
import {turso} from '../db'
import {Spending, SpendingCreate} from '../model/spending'
import type {Repo} from './repo'
import {ulid} from 'ulid'
import type {Client, Transaction} from '@libsql/client'

type SpendingFilters = {
  timestampFrom: number
}

export const SPENDINGS_TABLE_NAME = 'spendings'
const COL_NAMES = ['id', 'username', 'timestamp', 'amount', 'category'] as const

const genId = () => `sp_${ulid()}`

export const createSpendingRepo = (db: Client | Transaction) => {
  const create = async (spendingCreate: SpendingCreate) => {
    const id = genId()
    const vars = COL_NAMES.map(() => '?').join(', ')
    const spending = {...spendingCreate, id}
    const spendingValues = COL_NAMES.map(key => spending[key])
    await db.execute({
      sql: `INSERT INTO ${SPENDINGS_TABLE_NAME} (${COL_NAMES}) VALUES (${vars})`,
      args: spendingValues,
    })

    return id
  }

  const createMultiple = async (spendingsCreate: SpendingCreate[]) => {
    const spendings = spendingsCreate.map(spending => ({
      ...spending,
      id: genId(),
    }))
    const vars = spendings
      .map(() => `(${COL_NAMES.map(() => '?').join(', ')})`)
      .join(', ')
    const values = spendings.flatMap(spending =>
      COL_NAMES.map(key => spending[key]),
    )

    await db.execute({
      sql: `INSERT INTO ${SPENDINGS_TABLE_NAME} (${COL_NAMES}) VALUES ${vars}`,
      args: values,
    })
    return spendings.map(s => s.id)
  }

  const get = (id: string) =>
    db
      .execute({
        sql: `SELECT * FROM ${SPENDINGS_TABLE_NAME} WHERE id = ?`,
        args: [id],
      })
      .then(({rows}) => Spending.parse(rows[0]))

  const getList = (filters?: SpendingFilters) =>
    db
      .execute({
        sql: `SELECT * FROM ${SPENDINGS_TABLE_NAME} WHERE timestamp > ?`,
        args: [filters?.timestampFrom ?? 0],
      })
      .then(({rows}) => z.array(Spending).parse(rows))

  const replace = async (id: string, spending: Spending) => {
    const sets = COL_NAMES.map(cn => `${cn} = ${spending[cn]}`)
    const {rows} = await db.execute({
      sql: `UPDATE ${SPENDINGS_TABLE_NAME} SET ${sets} WHERE id = ?`,
      args: [id],
    })
    return Spending.parse(rows[0])
  }

  const remove = async (id: string) => {
    db.execute({sql: `DELETE FROM ${SPENDINGS_TABLE_NAME} WHERE id = ?`, args: [id]})
  }

  return {create, createMultiple, get, getList, replace, remove} satisfies Repo<
    Spending,
    SpendingCreate,
    SpendingFilters,
    string
  >
}

export const spendingRepo = createSpendingRepo(turso)
