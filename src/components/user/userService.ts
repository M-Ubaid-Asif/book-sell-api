import User from '../../models/user'

export const createUser = async (data: object) => {
  const doc = await User.create(data)
  return doc ? doc : false
}

export const finduserBy = async (filter: any, project: string) => {
  filter.isDeleted = false
  const doc = await User.findOne(filter, project)
  return doc ? doc : false
}

export const findAndUpdate = async (_id, data) => {
  const doc = await User.findByIdAndUpdate(_id, data)
  return doc ? doc : false
}

export const findAndDelete = async (data) => {
  data.isDeleted = false
  const doc = await User.findOne(data, 'isDeleted')
  if (!doc) {
    return false
  }
  doc.isDeleted = true
  const newDoc = await doc.save()
  return newDoc ? true : false
}
