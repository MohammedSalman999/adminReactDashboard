"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { moderatorSchema } from "@/schemas/ModeratorSchema";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ModeratorDashboardAssign() {
  const form = useForm({
    resolver: zodResolver(moderatorSchema),
    defaultValues: {
      vehicle_number: "",
      owner_name: "",
      owner_phone: "",
      status: "pending",
      city: "",
      name: "",
    },
  });

  const [users, setUsers] = useState([]);
  const city = form.watch("city");

  useEffect(() => {
    if (city) {
      fetchUsersByCity(city);
    }
  }, [city]);

  const fetchUsersByCity = async (city) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/moderators/users?city=${city}`,
        {
          params: { city },
        }
      );
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const onSubmit = async (formData) => {
    const { city, name, status, vehicle_number, owner_name, owner_phone } = formData;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/moderators/assign",
        {
          city,
          name,
          status,
          taskDetails: { vehicle_number, owner_name, owner_phone },
        },
        {
          withCredentials: true,
        }
      );
      console.log("Task assigned successfully", response.data);
      alert("Task Assigned Successfully.");
      form.reset();
    } catch (error) {
      console.error("Assigning task failed: ", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Assign Task</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="vehicle_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Vehicle Number</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full px-3 py-2 border rounded-md" />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="owner_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Owner Name</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full px-3 py-2 border rounded-md" />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="owner_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Owner Phone</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full px-3 py-2 border rounded-md" />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">City</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger className="w-full px-3 py-2 border rounded-md">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Cities</SelectLabel>
                      {["Jabalpur", "Sagar", "Indore", "Ujjain", "Gwalior"].map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Employees</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full px-3 py-2 border rounded-md">
                      <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Employees</SelectLabel>
                      {users.map((user, i) => (
                        <SelectItem
                          key={user._id || i}
                          value={user.name || "Unknown User"}
                        >
                          {user.name || "Unknown User"}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}

