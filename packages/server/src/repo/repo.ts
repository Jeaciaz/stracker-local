export type Repo<Entity, EntityCreate, Filters = never, Id = string> = {
  create: (entity: EntityCreate) => Promise<Id>
  createMultiple: (entities: EntityCreate[]) => Promise<Id[]>
  getList: (filters?: Filters) => Promise<Entity[]>
  get: (id: Id) => Promise<Entity | undefined>
  replace: (id: Id, entity: Entity) => Promise<Entity>
  remove: (id: Id) => Promise<void>
}
