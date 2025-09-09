"use client";
import { useEffect, useState, useRef } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Calendar } from "../components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { Plus, Trash, Edit, Save, X } from "lucide-react";
import { Label } from "../components/ui/label";
import { format } from "date-fns";
// If you have a popover component in another location, update the path accordingly.
// For example, if using Radix UI:
import { Popover, PopoverTrigger, PopoverContent } from "../components/ui/popover";
// Or, if you have the component elsewhere in your project, update the relative path:
// import { Popover, PopoverTrigger, PopoverContent } from "../../components/ui/popover";

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
  const currentMonthRef = useRef<HTMLTableCellElement | null>(null);

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

  useEffect(() => {
    // Scroll the current month column into view on mount
    if (currentMonthRef.current) {
      currentMonthRef.current.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, []);

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
      .sort((a, b) => a.getTime() - b.getTime())
      .map((date) => format(date, "d"))
      .join(", ");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-0 m-0 w-full">
      <Card className="w-full h-full overflow-x-auto shadow-xl rounded-none bg-white border-0">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 rounded-none">
          <CardTitle className="text-white text-2xl font-bold tracking-wide">
            Monthly Leave Dates Tracker - {currentYear}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 w-full">
          {/* Add New Team Member Section */}
          <div className="bg-blue-50 p-4 rounded-none border-b border-blue-200 shadow-sm w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <div>
                <Label htmlFor="memberName">Name</Label>
                <Input
                  id="memberName"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Enter team member name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Leave Dates</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      {newLeaveDates.length > 0
                        ? newLeaveDates.map(date => format(date, "MMM d")).join(", ")
                        : "Select leave dates"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="multiple"
                      selected={newLeaveDates}
                      onSelect={setNewLeaveDates}
                      className="rounded-md border mt-1"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-end">
                <Button onClick={addTeamMember} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </div>
            </div>
          </div>

          {/* Team Members Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="rounded-xl overflow-hidden">
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky left-0 bg-white z-20 w-[200px]">Team Member</TableHead>
                    {MONTHS.map((month, index) => (
                      <TableHead
                        key={month}
                        className="text-center min-w-[120px]"
                        ref={index === new Date().getMonth() ? currentMonthRef : undefined}
                      >
                        {month}
                      </TableHead>
                    ))}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map(member => (
                    <TableRow key={member.id}>
                      <TableCell className="sticky left-0 bg-white z-20 font-medium">
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
                            return (
                              <TableCell key={monthIndex} className="text-center">
                                -
                              </TableCell>
                            );
                          }
                        }
                        const leaveDates = getLeaveDatesForMonth(member, monthIndex);
                        return (
                          <TableCell
                            key={monthIndex}
                            ref={monthIndex === new Date().getMonth() ? currentMonthRef : undefined}
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
                                className="border-green-400 text-green-600 hover:bg-green-100"
                                onClick={() => saveEditMember(member.id)}
                              >
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-red-400 text-red-600 hover:bg-red-100"
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
                                className="border-blue-400 text-blue-600 hover:bg-blue-100"
                                onClick={() => startEditMember(member.id)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-red-400 text-red-600 hover:bg-red-100"
                                onClick={() => removeTeamMember(member.id)}
                              >
                                <Trash className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between bg-blue-50 rounded-none p-4 mt-4 w-full">
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