import React, { useState, useEffect, useCallback } from "react";
import type { User } from "@/types/User";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { BACKEND_URL } from "@/lib/constants";

interface SelectUsersProps {
  selectedUserIds: number[];
  onChange: (selectedUserIds: number[]) => void;
}

const SelectUsers: React.FC<SelectUsersProps> = ({
  selectedUserIds,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BACKEND_URL}/users/active`);
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data: User[] = await response.json();
        setAllUsers(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSelect = useCallback(
    (userId: number) => {
      const newSelectedUserIds = selectedUserIds.includes(userId)
        ? selectedUserIds.filter((id) => id !== userId)
        : [...selectedUserIds, userId];
      onChange(newSelectedUserIds);
    },
    [selectedUserIds, onChange]
  );

  const selectedUsers = allUsers.filter((user) =>
    selectedUserIds.includes(user.id)
  );

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedUserIds.length > 0
              ? `${selectedUserIds.length} utilisateur(s) sélectionné(s)`
              : "Sélectionner des utilisateurs..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList className="max-h-[8rem] overflow-y-auto">
              <CommandEmpty>
                {isLoading
                  ? "Chargement..."
                  : error
                  ? `Erreur: ${error}`
                  : "Aucun utilisateur trouvé."}
              </CommandEmpty>
              <CommandGroup>
                {allUsers
                  .filter((user) =>
                    `${user.firstName} ${user.lastName} ${user.email}`
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((user) => (
                    <CommandItem
                      key={user.id}
                      value={`${user.firstName} ${user.lastName} (${user.email})`}
                      onSelect={() => {
                        handleSelect(user.id);
                      }}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          selectedUserIds.includes(user.id)
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                      {user.firstName} {user.lastName} ({user.email})
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="space-x-1 space-y-1">
        {selectedUsers.map((user) => (
          <Badge key={user.id} variant="secondary" className="mr-1">
            {user.firstName} {user.lastName}
            <button
              type="button"
              className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => handleSelect(user.id)}
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SelectUsers;
