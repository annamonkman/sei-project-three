import Festival from '../models/festival.js'

export const getAllFestivals = async (_req, res) => {
  console.log('REQUEST MADE')
  const festivals = await Festival.find()
  console.log('GETTING Festival>>', festivals)
  return res.status(200).json(festivals)
}

export const getOneFestival = async (req, res) => {
  try {
    const { id } = req.params
    const singleFestival = await Festival.findById(id)
    if (!singleFestival) {
      throw new Error('No Festival with this id found>>', id)
    }
    return res.status(200).json(singleFestival)
  } catch (err) {
    console.log('Error in getOneFestival>>', err)
    return res.status(404).json({ message: 'Not found' })
  }
}

export const addFestival = async (req, res) => {
  console.log(req.currentUser)

  if (!req.currentUser) {
    return res.status(401).json({ message: 'Hey! You need to login to do that!' })
  }
  if (req.currentUser.isAdmin !== true) {
    return res.status(401).json({ message: 'Woah! You need to be an Admin for that!' })
  }
  try {
    const newFestival = { ...req.body, owner: req.currentUser._id }
    const festivalToAdd = await Festival.create(newFestival)
    return res.status(201).json(festivalToAdd)
  } catch (error) {
    if (error.message.indexOf('11000')) {
      console.log(error)
      return res.status(422).json({ message: error.message })
    }
    if (error instanceof SyntaxError) {
      console.log('ERROR>', error)
      return res.status(422).json({ message: error.message })
    }
  }
}

export const showFestival = async (req, res) => {
  try {
    const { id } = req.params
    const singleFestival = await Festival.findById(id).populate('owner')
    if (!singleFestival) {
      throw new Error('Cannot find that Festival!')
    }
    return res.status(200).json(singleFestival)
  } catch (err) {
    console.log('Woah there! That is not correct!', err)
    return res.status(404).json({ message: err.message })
  }
}

export const deleteFestival = async (req, res) => {
  try {
    const { id } = req.params
    const singleFestival = await Festival.findById(id)
    if (!singleFestival) throw new Error('Woah, that Festival is not here!')
    await singleFestival.remove()
    return res.status(202).json({ message: 'removed successfully' })
  } catch (err) {
    console.log('Woah there! Cannot delete this Festival')
    console.log(err)
    return res.sendStatus(404).json({ message: err })
  }
}

export const updateFestival = async (req, res) => {
  try {
    const { id } = req.params
    const singleFestival = await Festival.findById(id)
    if (!singleFestival) throw new Error('Woah, that Festival is not here!')
    Object.assign(singleFestival, req.body)
    await singleFestival.save()
    return res.status(202).json({ 'Updated Festival': singleFestival })
  } catch (err) {
    console.log('Woah there! Cannot update this festival')
    console.log(err)
    return res.sendStatus(404).json({ message: err.message })
  }
}

export const addAttendanceToFestival = async (req, res) => {
  try {
    const { id } = req.params
    const festival = await Festival.findById(id)
    if (!festival) throw new Error('Could not find festival')
    const newAttendanceInfo = { ...req.body, user: req.currentUser._id }
    const attendeeMatch = festival.festivalAttendance.filter((fest, index) => {
      return String(fest.user) === String(req.currentUser._id)
    }
    )
    const resultIndex = festival.festivalAttendance.indexOf(attendeeMatch[0])
    if (attendeeMatch.length === 0) {
      festival.festivalAttendance.push(newAttendanceInfo)
    } else {
      festival.festivalAttendance[resultIndex] = { ...newAttendanceInfo }
    }
    await festival.save()
    return res.status(200).json(festival)
  } catch (err) {
    console.log(err)
    return res.status().json({ message: err.message })
  }
}
