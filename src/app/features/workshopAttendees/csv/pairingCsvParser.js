import {parse as csvToJson} from 'papaparse'

// TODO: This should be coming from configuration
const commonLanguages = ['HTML', 'CSS', 'JS', 'Python', 'Ruby', 'SQL', 'Java']

const parseLanguagesFrom = information => commonLanguages.reduce(
  (acc, value) => information.toLowerCase().includes(value.toLowerCase()) && !acc.includes(value)
    ? [...acc, value]
    : acc,
  []
)

const parseStudent = entry => ({
  name: entry.Name,
  new: entry['New attendee'] === 'true',
  tutorial: entry.Tutorial,
  notes: entry.Note,
  languages: parseLanguagesFrom(`${entry.Note} ${entry.Tutorial}`)
})

const parseCoach = entry => ({
  name: entry.Name,
  new: entry['New attendee'] === 'true',
  skills: entry.Skills,
  notes: entry.Note,
  languages: parseLanguagesFrom(`${entry.Note} ${entry.Skills}`)
})

const parse = csv => {
  const json = csvToJson(csv, {header: true})
  const data = json.data

  const initialValue = {
    students: [],
    coaches: []
  }

  return data.reduce((acc, entry) => {
      switch (entry.Role) {
        case 'Student':
          return {
            students: [...acc.students, parseStudent(entry)],
            coaches: acc.coaches
          }
        case 'Coach':
          return {
            students: acc.students,
            coaches: [...acc.coaches, parseCoach(entry)]
          }
        default:
          return acc
      }
    },
    initialValue
  )
}

module.exports = { parse }