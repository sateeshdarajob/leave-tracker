"use client";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Calendar } from "../components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { Plus, Trash, Edit, Save, X } from "lucide-react";
import { Label } from "../components/ui/label";
import { format } from "date-fns";

interface TeamMember {
  id: string;
  name: string;
  leaveDates: Date[];
  isEditing: boolean;
  editName?: string;
  editLeaveDates?: Date[];
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const currentYear = new Date().getFullYear();

export default function MonthlyLeaveDatesTracker() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMemberName, setNewMemberName] = useState("");
  const [newLeaveDates, setNewLeaveDates] = useState<Date[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const data = localStorage.getItem("teamMembers");
    if (data) {
      setTeamMembers(
        JSON.parse(data).map((member: any) => ({
          ...member,
          leaveDates: member.leaveDates.map((d: string) => new Date(d)),
          editLeaveDates: member.editLeaveDates
            ? member.editLeaveDates.map((d: string) => new Date(d))
            : undefined,
        }))
      );
    }
  }, []);

  // Save to localStorage whenever teamMembers changes
  useEffect(() => {
    localStorage.setItem("teamMembers", JSON.stringify(teamMembers));
  }, [teamMembers]);

  const addTeamMember = () => {
    if (newMemberName.trim() && newLeaveDates.length > 0) {
      setTeamMembers([
        ...teamMembers,
        {
          id: Date.now().toString(),
          name: newMemberName.trim(),
          leaveDates: newLeaveDates,
          isEditing: false
        }
      ]);
      setNewMemberName("");
      setNewLeaveDates([]);
    }
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id));
  };

  const startEditMember = (id: string) => {
    setTeamMembers(teamMembers.map((member) =>
      member.id === id
        ? {
            ...member,
            isEditing: true,
            editName: member.name,
            editLeaveDates: member.leaveDates
          }
        : member
    ));
  };

  const cancelEditMember = (id: string) => {
    setTeamMembers(teamMembers.map((member) =>
      member.id === id
        ? { ...member, isEditing: false }
        : member
    ));
  };

  const saveEditMember = (id: string) => {
    setTeamMembers(teamMembers.map((member) => {
      if (member.id === id && member.editName && member.editLeaveDates && member.editLeaveDates.length > 0) {
        return {
          ...member,
          name: member.editName,
          leaveDates: member.editLeaveDates,
          isEditing: false
        };
      }
      return member;
    }));
  };

  const updateEditField = (id: string, field: "editName" | "editLeaveDates", value: any) => {
    setTeamMembers(teamMembers.map((member) =>
      member.id === id
        ? { ...member, [field]: value }
        : member
    ));
  };

  const getLeaveDatesForMonth = (member: TeamMember, monthIndex: number) => {
    return member.leaveDates
      .filter((date) => date.getMonth() === monthIndex && date.getFullYear() === currentYear)
      .sort((a, b) => a.getTime() - b.getTime()) // Sort dates in ascending order
      .map((date) => format(date, "d"))
      .join(", ");
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="memberName">Name</Label>
                <Input
                  id="memberName"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Enter team member name"
                  onKeyDown={(e) => e.key === "Enter" && addTeamMember()}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Leave Dates</Label>
                <Calendar
                  mode="multiple"
                  selected={newLeaveDates}
                  onSelect={setNewLeaveDates}
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
                  teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium sticky left-0 bg-white">
                        {member.isEditing ? (
                          <Input
                            value={member.editName}
                            onChange={(e) => updateEditField(member.id, "editName", e.target.value)}
                          />
                        ) : (
                          member.name
                        )}
                      </TableCell>
                      {MONTHS.map((_, monthIndex) => {
                        if (member.isEditing) {
                          // Only show calendar if there are leave dates for this month
                          const monthDates =
                            member.editLeaveDates?.filter(
                              (date) =>
                                date.getMonth() === monthIndex &&
                                date.getFullYear() === currentYear
                            ) || [];
                          if (monthDates.length > 0) {
                            return (
                              <TableCell key={monthIndex} className="text-center">
                                <Calendar
                                  mode="multiple"
                                  selected={monthDates}
                                  onSelect={(dates) => {
                                    // Merge selected dates for this month with other months
                                    const otherMonths =
                                      member.editLeaveDates?.filter(
                                        (date) =>
                                          date.getMonth() !== monthIndex ||
                                          date.getFullYear() !== currentYear
                                      ) || [];
                                    const newDates = [
                                      ...otherMonths,
                                      ...(Array.isArray(dates) ? dates : dates ? [dates] : [])
                                    ];
                                    updateEditField(member.id, "editLeaveDates", newDates);
                                  }}
                                  className="rounded-md border mt-1"
                                />
                              </TableCell>
                            );
                          } else {
                            // Show empty cell if no dates for this month
                            return (
                              <TableCell key={monthIndex} className="text-center">
                                -
                              </TableCell>
                            );
                          }
                        }
                        // Not editing: show leave dates as before
                        const leaveDates = getLeaveDatesForMonth(member, monthIndex);
                        return (
                          <TableCell
                            key={monthIndex}
                            className={`text-center ${leaveDates ? "bg-yellow-50" : ""}`}
                          >
                            {leaveDates || "-"}
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {member.isEditing ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => saveEditMember(member.id)}
                              >
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => cancelEditMember(member.id)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startEditMember(member.id)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeTeamMember(member.id)}
                              >
                                <Trash className="w-4 h-4 text-red-500" />
                              </Button>
                            </>
                          )}
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
            {teamMembers.length} team member{teamMembers.length !== 1 ? "s" : ""}
          </div>
          <Button
            variant="default"
            disabled={teamMembers.length === 0}
            onClick={() => {
              // In a real app, you would save to your backend here
              console.log("Leave data:", teamMembers);
              alert("Leave data saved successfully!");
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