export interface Task {
    id: string
    title: string
    completed: boolean
    time: string
    project?: string
    tag?: string
    members?: string[]
  }
  
 export interface PrivateGroup {
    id: string
    name: string
    iconName: string
    tasks: Task[]
  }

  export const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  