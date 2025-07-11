import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

const CATEGORIES = [
  { value: 'personal', label: 'Personal', color: 'bg-blue-500' },
  { value: 'work', label: 'Work', color: 'bg-green-500' },
  { value: 'health', label: 'Health', color: 'bg-red-500' },
  { value: 'learning', label: 'Learning', color: 'bg-purple-500' },
  { value: 'other', label: 'Other', color: 'bg-gray-500' },
];

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [goals, setGoals] = useState([]);
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingTodo, setEditingTodo] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newTodo, setNewTodo] = useState({ title: '', description: '', status: 'pending', category: 'personal', date: '' });
  const [newGoal, setNewGoal] = useState({ title: '', description: '' });

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    const savedGoals = localStorage.getItem('goals');
    if (savedTodos) setTodos(JSON.parse(savedTodos));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const addTodo = () => {
    const newTodoData = {
      ...newTodo,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => [newTodoData, ...prev]);
    setNewTodo({ title: '', description: '', status: 'pending', category: 'personal', date: '' });
    setIsAddingTodo(false);
    toast.success('Todo added successfully!');
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    toast.success('Todo deleted successfully!');
  };

  const addGoal = () => {
    const newGoalData = {
      ...newGoal,
      id: Date.now().toString(),
      progress: 0,
      todos: [],
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [newGoalData, ...prev]);
    setNewGoal({ title: '', description: '' });
    setIsAddingGoal(false);
    toast.success('Goal added successfully!');
  };

  const deleteGoal = (id) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
    toast.success('Goal deleted successfully!');
  };

  const filteredTodos = todos.filter((todo) => {
    const statusMatch = filter === 'all' || todo.status === filter;
    const categoryMatch = categoryFilter === 'all' || todo.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.status === 'completed').length,
    pending: todos.filter((t) => t.status === 'pending').length,
    inProgress: todos.filter((t) => t.status === 'in-progress').length,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-black tracking-tighter mb-2">Daily Life Tracker</h1>
        <p className="text-muted-foreground">Track your goals and manage your daily tasks</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {Object.entries(stats).map(([key, value]) => (
          <Card key={key}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground capitalize">{key}</p>
              <p className="text-xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="todos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="todos">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={() => setIsAddingTodo(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Todo
            </Button>
          </div>

          <div className="space-y-3">
            {filteredTodos.length === 0 ? (
              <p className="text-muted-foreground">No todos found.</p>
            ) : (
              filteredTodos.map((todo) => (
                <Card key={todo.id}>
                  <CardContent className="p-4 flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{todo.title}</h3>
                      <p className="text-sm text-muted-foreground">{todo.description}</p>
                      {todo.date && <p className="text-xs text-muted-foreground mt-1">Due: {todo.date}</p>}
                      <div className="mt-2 flex gap-2">
                        <Badge className={CATEGORIES.find((c) => c.value === todo.category)?.color}>
                          {todo.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => setEditingTodo(todo)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => deleteTodo(todo.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="goals">
          <div className="flex justify-end mb-4">
            <Button onClick={() => setIsAddingGoal(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Goal
            </Button>
          </div>

          <div className="space-y-3">
            {goals.length === 0 ? (
              <p className="text-muted-foreground">No goals yet.</p>
            ) : (
              goals.map((goal) => (
                <Card key={goal.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold">{goal.title}</h3>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => setEditingGoal(goal)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => deleteGoal(goal.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                    <Progress value={goal.progress} className="mt-4" />
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Todo Dialog */}
      <Dialog open={isAddingTodo} onOpenChange={setIsAddingTodo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Todo</DialogTitle>
          </DialogHeader>
          <Input placeholder="Title" value={newTodo.title} onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })} />
          <Textarea placeholder="Description" value={newTodo.description} onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })} />
          <Input type="date" value={newTodo.date} onChange={(e) => setNewTodo({ ...newTodo, date: e.target.value })} />
          <Select value={newTodo.category} onValueChange={(val) => setNewTodo({ ...newTodo, category: val })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={addTodo}>Add</Button>
        </DialogContent>
      </Dialog>

      {/* Edit Todo Dialog */}
      <Dialog open={!!editingTodo} onOpenChange={() => setEditingTodo(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Todo</DialogTitle>
          </DialogHeader>
          {editingTodo && (
            <>
              <Input value={editingTodo.title} onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })} />
              <Textarea value={editingTodo.description} onChange={(e) => setEditingTodo({ ...editingTodo, description: e.target.value })} />
              <Input type="date" value={editingTodo.date} onChange={(e) => setEditingTodo({ ...editingTodo, date: e.target.value })} />
              <Select value={editingTodo.category} onValueChange={(val) => setEditingTodo({ ...editingTodo, category: val })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={editingTodo.status} onValueChange={(val) => setEditingTodo({ ...editingTodo, status: val })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => {
                setTodos((prev) => prev.map((t) => (t.id === editingTodo.id ? editingTodo : t)));
                setEditingTodo(null);
                toast.success('Todo updated!');
              }}>Save Changes</Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Goal Dialog */}
      <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Goal</DialogTitle>
          </DialogHeader>
          <Input placeholder="Title" value={newGoal.title} onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })} />
          <Textarea placeholder="Description" value={newGoal.description} onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })} />
          <Button onClick={addGoal}>Add</Button>
        </DialogContent>
      </Dialog>

      {/* Edit Goal Dialog */}
      <Dialog open={!!editingGoal} onOpenChange={() => setEditingGoal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
          </DialogHeader>
          {editingGoal && (
            <>
              <Input value={editingGoal.title} onChange={(e) => setEditingGoal({ ...editingGoal, title: e.target.value })} />
              <Textarea value={editingGoal.description} onChange={(e) => setEditingGoal({ ...editingGoal, description: e.target.value })} />
              <Input type="number" value={editingGoal.progress} onChange={(e) => setEditingGoal({ ...editingGoal, progress: Number(e.target.value) })} />
              <Button onClick={() => {
                setGoals((prev) => prev.map((g) => (g.id === editingGoal.id ? editingGoal : g)));
                setEditingGoal(null);
                toast.success('Goal updated!');
              }}>Save Changes</Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
