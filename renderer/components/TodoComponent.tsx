'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scrollarea"
import { Checkbox } from "./ui/checkbox"
import { Input } from "./ui/input"
import {
  Home,
  Plus,
  ChevronDown,
  Briefcase,
  Book,
  Car,
  User,
  Utensils,
  Trash2,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import TimePickerComponent from './TimePicker'

interface Task {
  id: string
  title: string
  completed: boolean
  time: string
  project?: string
  tag?: string
  members?: string[]
}

interface PrivateGroup {
  id: string
  name: string
  iconName: string
  tasks: Task[]
}

declare global {
  interface Window {
    electron: {
      saveData: (data: { privateGroups: PrivateGroup[] }) => void
      loadData: () => Promise<{ privateGroups: PrivateGroup[] }>
    }
  }
}

export default function Component() {
  const [privateGroups, setPrivateGroups] = useState<PrivateGroup[]>([
    { id: '1', name: 'Home', iconName: 'Home', tasks: [] }
  ])
  const [selectedGroupId, setSelectedGroupId] = useState('1')
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupIcon, setNewGroupIcon] = useState('Home')
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskTime, setNewTaskTime] = useState('')
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const loadedData = await window.electron.loadData()
      if (loadedData.privateGroups.length > 0) {
        setPrivateGroups(loadedData.privateGroups)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    window.electron.saveData({ privateGroups })
  }, [privateGroups])

  const addPrivateGroup = () => {
    if (newGroupName.trim() !== '') {
      const newGroup: PrivateGroup = {
        id: Date.now().toString(),
        name: newGroupName,
        iconName: newGroupIcon,
        tasks: []
      }
      setPrivateGroups([...privateGroups, newGroup])
      setNewGroupName('')
      setNewGroupIcon('Home')
    }
  }

  const deletePrivateGroup = (groupId: string) => {
    setPrivateGroups(privateGroups.filter(group => group.id !== groupId))
    if (selectedGroupId === groupId) {
      setSelectedGroupId(privateGroups[0].id)
    }
  }

  const addTask = () => {
    if (newTaskTitle.trim() !== '' && newTaskTime.trim() !== '') {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        completed: false,
        time: newTaskTime,
      }
      setPrivateGroups(privateGroups.map(group => 
        group.id === selectedGroupId 
          ? { ...group, tasks: [...group.tasks, newTask] }
          : group
      ))
      setNewTaskTitle('')
      setNewTaskTime('')
      setIsAddTaskDialogOpen(false)
    }
  }

  const toggleTask = (taskId: string) => {
    setPrivateGroups(privateGroups.map(group => 
      group.id === selectedGroupId
        ? {
            ...group,
            tasks: group.tasks.map(task => 
              task.id === taskId ? { ...task, completed: !task.completed } : task
            )
          }
        : group
    ))
  }

  const deleteTask = (taskId: string) => {
    setPrivateGroups(privateGroups.map(group => 
      group.id === selectedGroupId
        ? {
            ...group,
            tasks: group.tasks.filter(task => task.id !== taskId)
          }
        : group
    ))
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Home': return <Home className="w-4 h-4" />;
      case 'Briefcase': return <Briefcase className="w-4 h-4" />;
      case 'Book': return <Book className="w-4 h-4" />;
      case 'Car': return <Car className="w-4 h-4" />;
      case 'User': return <User className="w-4 h-4" />;
      case 'Utensils': return <Utensils className="w-4 h-4" />;
      default: return <Home className="w-4 h-4" />;
    }
  }

  const selectedGroup = privateGroups.find(group => group.id === selectedGroupId) || privateGroups[0]

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-background p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Private</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Private Group</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="group-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="group-name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="group-icon" className="text-right">
                    Icon
                  </Label>
                  <Select onValueChange={(value) => setNewGroupIcon(value)} defaultValue="Home">
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select an icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Home">Home</SelectItem>
                      <SelectItem value="Briefcase">Briefcase</SelectItem>
                      <SelectItem value="Book">Book</SelectItem>
                      <SelectItem value="Car">Car</SelectItem>
                      <SelectItem value="User">User</SelectItem>
                      <SelectItem value="Utensils">Utensils</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={addPrivateGroup}>Add Group</Button>
            </DialogContent>
          </Dialog>
        </div>
        
        <ScrollArea className="h-[calc(100vh-8rem)]">
          {/* Private Groups */}
          <div className="space-y-1">
            {privateGroups.map(group => (
              <div key={group.id} className="flex items-center">
                <Button
                  variant={group.id === selectedGroupId ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                  onClick={() => setSelectedGroupId(group.id)}
                >
                  {getIconComponent(group.iconName)}
                  <span>{group.name}</span>
                  <span className="ml-auto text-muted-foreground">{group.tasks.length}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deletePrivateGroup(group.id)}
                  className="ml-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-1">Good Morning, Vikas! 👋</h1>
              <p className="text-muted-foreground">Today, {currentDate}</p>
            </div>
          </div>

          {/* Tasks */}
          <div className="space-y-4">
            {selectedGroup.tasks.map(task => (
              <div
                key={task.id}
                className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                />
                <div className="flex-1">
                  <h3 className={`font-medium transition-all duration-300 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </h3>
                  {task.tag && (
                    <div className="flex gap-2 mt-1">
                      <span className="text-sm text-blue-500">{task.tag}</span>
                    </div>
                  )}
                </div>
                {task.members && (
                  <div className="flex -space-x-2">
                    {task.members.map((member, i) => (
                      <Avatar key={i} className="border-2 border-background w-8 h-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>U{i}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                )}
                <div className="text-sm text-muted-foreground">{task.time}</div>
                <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Create New Task Button */}
          <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="fixed bottom-8 left-1/2 -translate-x-1/2 rounded-full px-8" 
                variant="default"
                onClick={() => setIsAddTaskDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create new task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task to {selectedGroup.name}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="task-title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="task-title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="task-time" className="text-right">
    Time
  </Label>
  <div className="col-span-3">
    <TimePickerComponent
      onTimeSelect={(time) => setNewTaskTime(time)}
      defaultValue={newTaskTime}
    />
  </div>
                   </div>
                  </div>

              <Button onClick={addTask}>Add Task</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}