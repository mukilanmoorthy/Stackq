import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  CheckSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigationItems = [
  { icon: Home, label: 'Home', active: true },
  { icon: CheckSquare, label: 'Todo Tracker' },
];

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-background border-r border-border h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="p-4">
        <nav className="space-y-1">
          {navigationItems.map((item, index) => (
            <Button
              key={index}
              variant={item.active ? "secondary" : "ghost"}
              className="w-full justify-start text-left h-auto py-2 px-3"
              onClick={() => {
                if (item.label === 'Home') {
                  navigate('/');
                } else if (item.label === 'Todo Tracker') {
                  navigate('/todos');
                }
              }}
            >
              <item.icon className="h-4 w-4 mr-3" />
              <span className="flex-1">{item.label}</span>
            </Button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
