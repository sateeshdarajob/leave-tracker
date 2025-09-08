"use client";
import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Calendar } from '../components/ui/calendar';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../components/ui/table';
import { Plus, Trash, Edit, Save } from "lucide-react";
import { Label } from '../components/ui/label';
import { format, isWithinInterval, eachDayOfInterval, parseISO } from "date-fns";

interface TeamMember {
  id: string;
  name: string;
  leaveDates: Date[];
  isEditing: boolean;
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const currentYear = new Date().getFullYear();

export default function MonthlyLeaveDatesTracker() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newLeaveStartDate, setNewLeaveStartDate] = useState<Date | undefined>(new Date());
  const [newLeaveEndDate, setNewLeaveEndDate] = useState<Date | undefined>(new Date());

  const addTeamMember = () => {
    if (newMemberName.trim() && newLeaveStartDate && newLeaveEndDate) {
      const leaveDates = eachDayOfInterval({
        start: newLeaveStartDate,
        end: newLeaveEndDate
      });
      
      setTeamMembers([...teamMembers, {
        id: Date.now().toString(),
        name: newMemberName.trim(),
        leaveDates,
        isEditing: false
      }]);
      setNewMemberName('');
      setNewLeaveStartDate(new Date());
      setNewLeaveEndDate(new Date());
    }
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
  };

  const getLeaveDatesForMonth = (member: TeamMember, monthIndex: number) => {
    return member.leaveDates
      .filter(date => date.getMonth() === monthIndex && date.getFullYear() === currentYear)
      .map(date => format(date, 'd'))
      .join(', ');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Card className="max-w-full mx-auto overflow-x-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Monthly Leave Dates Tracker - {currentYear}</span>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Add New Team Member Section */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Add Team Member</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="memberName">Name</Label>
                <Input
                  id="memberName"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Enter team member name"
                  onKeyDown={(e) => e.key === 'Enter' && addTeamMember()}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Leave Start Date</Label>
                <Calendar
                  mode="single"
                  selected={newLeaveStartDate}
                  onSelect={setNewLeaveStartDate}
                  className="rounded-md border mt-1"
                />
              </div>
              <div>
                <Label>Leave End Date</Label>
                <Calendar
                  mode="single"
                  selected={newLeaveEndDate}
                  onSelect={setNewLeaveEndDate}
                  className="rounded-md border mt-1"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={addTeamMember} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </div>
            </div>
          </div>

          {/* Team Members Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px] sticky left-0 bg-white">Team Member</TableHead>
                  {MONTHS.map((month, index) => (
                    <TableHead key={month} className="text-center min-w-[120px]">
                      {month}
                    </TableHead>
                  ))}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.length > 0 ? (
                  teamMembers.map(member => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium sticky left-0 bg-white">
                        {member.name}
                      </TableCell>
                      {MONTHS.map((_, monthIndex) => {
                        const leaveDates = getLeaveDatesForMonth(member, monthIndex);
                        return (
                          <TableCell 
                            key={monthIndex} 
                            className={`text-center ${leaveDates ? 'bg-yellow-50' : ''}`}
                          >
                            {leaveDates || '-'}
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              if (member.leaveDates.length > 0) {
                                setNewLeaveStartDate(member.leaveDates[0]);
                                setNewLeaveEndDate(member.leaveDates[member.leaveDates.length - 1]);
                              }
                              removeTeamMember(member.id);
                            }}
                          >
                            <Trash className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={13} className="text-center py-8 text-gray-500">
                      No team members added yet. Add your first team member above.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500">
            {teamMembers.length} team member{teamMembers.length !== 1 ? 's' : ''}
          </div>
          <Button 
            variant="default"
            disabled={teamMembers.length === 0}
            onClick={() => {
              // In a real app, you would save to your backend here
              console.log('Leave data:', teamMembers);
              alert('Leave data saved successfully!');
            }}
          >
            <Save className="w-4 h-4 mr-2" />
            Save All Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}