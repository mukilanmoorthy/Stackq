import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';

export default function FeaturedPost() {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0 mb-6">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Badge variant="secondary" className="bg-white/20 text-primary-foreground">
            Welcome to Stackq
          </Badge>
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-4">
          <div className="bg-white/10 rounded-lg p-6 text-center">
            <div className="text-4xl mb-3">✨</div>
            <h2 className="text-2xl font-bold mb-2">Start Your Blogging Journey</h2>
            <p className="text-primary-foreground/90 mb-4">
              Share your thoughts, experiences, and knowledge with the community
            </p>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/create')}
              className="bg-white text-primary hover:bg-white/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Post
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}