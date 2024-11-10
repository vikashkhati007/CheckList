'use client'

import * as React from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scrollarea"
import { Checkbox } from "./ui/checkbox"
import { Input } from "./ui/input"
import { Progress } from "./ui/progress"
import { Calendar } from "./ui/calendar"
import {
  Home,
  Plus,
  Briefcase,
  Book,
  Car,
  User,
  Utensils,
  Trash2,
  Edit2,
  Flag,
  Filter,
  SortAsc,
  AlertCircle
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Label } from "./ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"
import TimePickerComponent from "./TimePicker"
import { ModeToggle } from "./Theme"
import { format } from "date-fns"
import DueDatePicker from "./DueDatePicker"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { cn } from "lib/utils"

interface Task {
  id: string
  title: string
  completed: boolean
  time: string
  priority: 'low' | 'medium' | 'high'
  dueDate: Date | null
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
  const [privateGroups, setPrivateGroups] = React.useState<PrivateGroup[]>([
    { id: "1", name: "Home", iconName: "Home", tasks: [] },
  ])
  const [selectedGroupId, setSelectedGroupId] = React.useState("1")
  const [newGroupName, setNewGroupName] = React.useState("")
  const [newGroupIcon, setNewGroupIcon] = React.useState("Home")
  const [newTaskTitle, setNewTaskTitle] = React.useState("")
  const [newTaskTime, setNewTaskTime] = React.useState("")
  const [newTaskPriority, setNewTaskPriority] = React.useState<'low' | 'medium' | 'high'>('medium')
  const [newTaskDueDate, setNewTaskDueDate] = React.useState<Date | null>(null)
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = React.useState(false)
  const [editingTask, setEditingTask] = React.useState<Task | null>(null)
  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = React.useState(false)
  const [filterPriority, setFilterPriority] = React.useState<'low' | 'medium' | 'high' | 'all'>('all')
  const [sortBy, setSortBy] = React.useState<'priority' | 'dueDate' | 'none'>('none')
  const [showCongratulations, setShowCongratulations] = React.useState(false)

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const loadedData = await window.electron.loadData()
        if (loadedData.privateGroups.length > 0) {
          setPrivateGroups(loadedData.privateGroups)
          setSelectedGroupId(loadedData.privateGroups[0].id)
        }
      } catch (error) {
        console.error("Failed to load data:", error)
      }
    }
    loadData()
  }, [])

  const selectedGroup =
  privateGroups.find((group) => group.id === selectedGroupId) ||
  privateGroups[0]

  React.useEffect(() => {
    try {
      window.electron.saveData({ privateGroups })
    } catch (error) {
      console.error("Failed to save data:", error)
    }
  }, [privateGroups])

  React.useEffect(() => {
    if (selectedGroup && selectedGroup.tasks.length > 0) {
      const allTasksCompleted = selectedGroup.tasks.every(task => task.completed)
      if (allTasksCompleted) {
        setShowCongratulations(true)
        // Hide the alert after 5 seconds
        setTimeout(() => setShowCongratulations(false), 5000)
      }
    }
  }, [selectedGroup])

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index

    setPrivateGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === selectedGroupId) {
          const newTasks = Array.from(group.tasks)
          const [reorderedItem] = newTasks.splice(sourceIndex, 1)
          newTasks.splice(destinationIndex, 0, reorderedItem)
          return { ...group, tasks: newTasks }
        }
        return group
      })
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault()
      action()
    }
  }

  const handleAddGroup = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (newGroupName.trim() !== "") {
      const newGroup: PrivateGroup = {
        id: Date.now().toString(),
        name: newGroupName,
        iconName: newGroupIcon,
        tasks: [],
      }
      setPrivateGroups((prevGroups) => [...prevGroups, newGroup])
      setNewGroupName("")
      setNewGroupIcon("Home")
    }
  }

  const deletePrivateGroup = (groupId: string) => {
    setPrivateGroups((prevGroups) => {
      if (prevGroups.length <= 1) {
        return prevGroups
      }
      const updatedGroups = prevGroups.filter((group) => group.id !== groupId)
      if (selectedGroupId === groupId) {
        setSelectedGroupId(updatedGroups[0].id)
      }
      return updatedGroups
    })
  }

  const handleAddTask = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (newTaskTitle.trim() !== "" && newTaskTime.trim() !== "") {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        completed: false,
        time: newTaskTime,
        priority: newTaskPriority,
        dueDate: newTaskDueDate,
      }
      setPrivateGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === selectedGroupId
            ? { ...group, tasks: [...group.tasks, newTask] }
            : group
        )
      )
      setNewTaskTitle("")
      setNewTaskTime("")
      setNewTaskPriority('medium')
      setNewTaskDueDate(null)
      setIsAddTaskDialogOpen(false)
    }
  }

  const toggleTask = (taskId: string) => {
    setPrivateGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === selectedGroupId
          ? {
              ...group,
              tasks: group.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, completed: !task.completed }
                  : task
              ),
            }
          : group
      )
    )
  }

  const deleteTask = (taskId: string) => {
    setPrivateGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.id === selectedGroupId
          ? {
              ...group,
              tasks: group.tasks.filter((task) => task.id !== taskId),
            }
          : group
      )
    )
  }

  const editTask = (task: Task) => {
    setEditingTask(task)
    setIsEditTaskDialogOpen(true)
  }

  const handleEditTask = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (
      editingTask &&
      editingTask.title.trim() !== "" &&
      editingTask.time.trim() !== ""
    ) {
      setPrivateGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === selectedGroupId
            ? {
                ...group,
                tasks: group.tasks.map((task) =>
                  task.id === editingTask.id ? editingTask : task
                ),
              }
            : group
        )
      )
      setIsEditTaskDialogOpen(false)
      setEditingTask(null)
    }
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Home":
        return <Home className="w-4 h-4" />
      case "Briefcase":
        return <Briefcase className="w-4 h-4" />
      case "Book":
        return <Book className="w-4 h-4" />
      case "Car":
        return <Car className="w-4 h-4" />
      case "User":
        return <User className="w-4 h-4" />
      case "Utensils":
        return <Utensils className="w-4 h-4" />
      default:
        return <Home className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low':
        return 'text-green-500'
      case 'medium':
        return 'text-yellow-500'
      case 'high':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }



  const filteredAndSortedTasks = React.useMemo(() => {
    let tasks = selectedGroup?.tasks || []

    if (filterPriority !== 'all') {
      tasks = tasks.filter((task) => task.priority === filterPriority)
    }

    if (sortBy === 'priority') {
      tasks = tasks.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })
    } else if (sortBy === 'dueDate') {
      tasks = tasks.sort((a, b) => {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return a.dueDate.getTime() - b.dueDate.getTime()
      })
    }

    return tasks
  }, [selectedGroup, filterPriority, sortBy])

  const groupProgress = React.useMemo(() => {
    if (!selectedGroup) return 0
    const completedTasks = selectedGroup.tasks.filter((task) => task.completed).length
    return (completedTasks / selectedGroup.tasks.length) * 100
  }, [selectedGroup])

  return (
    <div className="flex h-screen bg-background">
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
                    onKeyDown={(e) => handleKeyPress(e, handleAddGroup)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="group-icon" className="text-right">
                    Icon
                  </Label>
                  <Select
                    onValueChange={(value) => setNewGroupIcon(value)}
                    defaultValue="Home"
                  >
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
              <Button onClick={handleAddGroup}>Add Group</Button>
            </DialogContent>
          </Dialog>
        </div>

        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-1">
            {privateGroups.map((group) => (
              <div key={group.id} className="flex items-center">
                <Button
                  variant={group.id === selectedGroupId ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                  onClick={() => setSelectedGroupId(group.id)}
                >
                  {getIconComponent(group.iconName)}
                  <span>{group.name}</span>
                  <span className="ml-auto text-muted-foreground">
                    {group.tasks.length}
                  </span>
                </Button>
                {privateGroups.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deletePrivateGroup(group.id)}
                    className="ml-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div>
          <ModeToggle />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-xl font-bold mb-1">
                Good Morning, Vikas! 👋
              </h1>
              <p className="text-muted-foreground">Today, {format(new Date(), 'MMMM d, yyyy')}</p>
            </div>
            <div className="flex items-center gap-4">
              <Select
                value={filterPriority}
                onValueChange={(value: 'low' | 'medium' | 'high' | 'all') => setFilterPriority(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All priorities</SelectItem>
                  <SelectItem value="low">Low priority</SelectItem>
                  <SelectItem value="medium">Medium priority</SelectItem>
                  <SelectItem value="high">High priority</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sortBy}
                onValueChange={(value: 'priority' | 'dueDate' | 'none') => setSortBy(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No sorting</SelectItem>
                  <SelectItem value="priority">Sort by priority</SelectItem>
                  <SelectItem value="dueDate">Sort by due date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {showCongratulations && (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Congratulations!</AlertTitle>
              <AlertDescription>
                You've completed all tasks in this group. Great job!
              </AlertDescription>
            </Alert>
          )}

          {selectedGroup && (
            <>
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">{selectedGroup.name} Progress</h2>
                <Progress value={groupProgress} className={cn('w-full h-2 [&>*]:bg-green-400')} />
              </div>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={selectedGroup.id}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {filteredAndSortedTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                            >
                              <Checkbox
                                checked={task.completed}
                                onCheckedChange={() => toggleTask(task.id)}
                              />
                              <div className="flex-1">
                                <h3
                                  className={`font-medium transition-all duration-300 ${
                                    task.completed
                                      ? "line-through text-muted-foreground"
                                      : ""
                                  }`}
                                >
                                  {task.title}
                                </h3>
                                {task.tag && (
                                  <div className="flex gap-2 mt-1">
                                    <span className="text-sm text-blue-500">
                                      {task.tag}
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2 mt-1">
                                  <Flag className={`w-4 h-4 ${getPriorityColor(task.priority)}`} />
                                  <span className="text-sm text-muted-foreground">
                                    {task.priority}
                                  </span>
                                  {task.dueDate && (
                                    <span className="text-sm text-muted-foreground">
                                      Due: {format(task.dueDate, 'MMM d, yyyy')}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {task.members && (
                                <div className="flex -space-x-2">
                                  {task.members.map((member, i) => (
                                    <Avatar
                                      key={i}
                                      className="border-2 border-background w-8 h-8"
                                    >
                                      <AvatarImage src="/placeholder.svg" />
                                      <AvatarFallback>U{i}</AvatarFallback>
                                    </Avatar>
                                  ))}
                                </div>
                              )}
                              <div className="text-sm text-muted-foreground">
                                {task.time}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => editTask(task)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteTask(task.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </>
          )}

          <Dialog
            open={isAddTaskDialogOpen}
            onOpenChange={setIsAddTaskDialogOpen}
          >
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
                <DialogTitle>Add New Task to {selectedGroup?.name}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="task-title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="task-title"
                    value={newTaskTitle}
                    onKeyDown={(e) => handleKeyPress(e, handleAddTask)}
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="task-priority" className="text-right">
                    Priority
                  </Label>
                  <Select
                    value={newTaskPriority}
                    onValueChange={(value: 'low' | 'medium' | 'high') => setNewTaskPriority(value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="task-due-date" className="text-right">
                    Due Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`col-span-3 justify-start text-left font-normal ${
                          !newTaskDueDate && "text-muted-foreground"
                        }`}
                      >
                        {newTaskDueDate ? format(newTaskDueDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <div className="w-full">
                      <Calendar
                        mode="single"
                        selected={newTaskDueDate}
                        onSelect={setNewTaskDueDate}
                      />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <Button onClick={handleAddTask}>Add Task</Button>
            </DialogContent>
          </Dialog>
          <Dialog
            open={isEditTaskDialogOpen}
            onOpenChange={setIsEditTaskDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-task-title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="edit-task-title"
                    value={editingTask?.title || ""}
                    onChange={(e) =>
                      setEditingTask((prev) =>
                        prev ? { ...prev, title: e.target.value } : null
                      )
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-task-time" className="text-right">
                    Time
                  </Label>
                  <div className="col-span-3">
                    <TimePickerComponent
                      onTimeSelect={(time) =>
                        setEditingTask((prev) =>
                          prev ? { ...prev, time } : null
                        )
                      }
                      defaultValue={editingTask?.time}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-task-priority" className="text-right">
                    Priority
                  </Label>
                  <Select
                    value={editingTask?.priority}
                    onValueChange={(value: 'low' | 'medium' | 'high') =>
                      setEditingTask((prev) =>
                        prev ? { ...prev, priority: value } : null
                      )
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4 w-full">
                  <Label htmlFor="edit-task-due-date" className="text-right">
                    Due Date
                  </Label>
                  <DueDatePicker 
                    date={editingTask?.dueDate} 
                    onDateChange={(date) => setEditingTask((prev) =>
                      prev ? { ...prev, dueDate: date } : null
                    )}
                  />
                </div>
              </div>
              <Button onClick={handleEditTask}>Save Changes</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}