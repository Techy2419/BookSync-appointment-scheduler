
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

export type MeetingType = {
  id: string;
  name: string;
  duration: number;
  description: string;
};

interface MeetingTypeSelectorProps {
  meetingTypes: MeetingType[];
  selectedMeetingType: string | null;
  onSelectMeetingType: (id: string) => void;
}

const MeetingTypeSelector: React.FC<MeetingTypeSelectorProps> = ({
  meetingTypes,
  selectedMeetingType,
  onSelectMeetingType
}) => {
  return (
    <div className="space-y-4 mb-8">
      <h2 className="text-xl font-semibold">Select Meeting Type</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {meetingTypes.map((type) => (
          <Card 
            key={type.id}
            className={`cursor-pointer transition-all hover:border-primary hover:shadow-md ${
              selectedMeetingType === type.id ? 'border-primary shadow-md bg-primary/5' : ''
            }`}
            onClick={() => onSelectMeetingType(type.id)}
          >
            <CardHeader className="pb-2">
              <CardTitle>{type.name}</CardTitle>
              <CardDescription className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {type.duration} {type.duration === 1 ? 'minute' : 'minutes'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{type.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MeetingTypeSelector;
