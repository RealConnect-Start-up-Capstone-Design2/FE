import { useCallback, useEffect, useState } from "react";
import type { ApartmentWithProperty } from "../types";

interface UsePropertySidebarParams {
  apartments: ApartmentWithProperty[];
}

export function usePropertySidebar({ apartments }: UsePropertySidebarParams) {
  const [selectedPropertyId, setSelectedPropertyId] = useState<
    string | number | undefined
  >();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lastViewedPropertyId, setLastViewedPropertyId] = useState<
    string | number | undefined
  >();

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const selectProperty = useCallback((propertyId: string | number) => {
    setSelectedPropertyId(propertyId);
    setLastViewedPropertyId(propertyId);
    setIsSidebarOpen(true);
  }, []);

  const resetSelection = useCallback(() => {
    setSelectedPropertyId(undefined);
    setIsSidebarOpen(false);
    setLastViewedPropertyId(undefined);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedPropertyId(undefined);
    closeSidebar();
  }, [closeSidebar]);

  const handlePropertyClick = useCallback(
    (propertyId: string | number) => {
      if (selectedPropertyId === propertyId && isSidebarOpen) {
        clearSelection();
        return;
      }

      selectProperty(propertyId);
    },
    [clearSelection, isSidebarOpen, selectProperty, selectedPropertyId],
  );

  const handleToggleSidebar = useCallback(() => {
    if (isSidebarOpen) {
      closeSidebar();
      return;
    }

    const firstApartmentId = apartments[0]?.apartmentId;
    const preferredTarget =
      selectedPropertyId ?? lastViewedPropertyId ?? firstApartmentId;

    const resolvedTarget = apartments.some(
      (apt) => apt.apartmentId === preferredTarget,
    )
      ? preferredTarget
      : firstApartmentId;

    if (resolvedTarget !== undefined) {
      setSelectedPropertyId(resolvedTarget);
      setLastViewedPropertyId(resolvedTarget);
    }

    setIsSidebarOpen(true);
  }, [
    apartments,
    closeSidebar,
    isSidebarOpen,
    lastViewedPropertyId,
    selectedPropertyId,
  ]);

  const handleExternalClick = useCallback(() => {
    if (!isSidebarOpen && selectedPropertyId === undefined) {
      return;
    }
    clearSelection();
  }, [clearSelection, isSidebarOpen, selectedPropertyId]);

  const displayedPropertyId = selectedPropertyId ?? lastViewedPropertyId;

  useEffect(() => {
    if (
      selectedPropertyId &&
      !apartments.some((apt) => apt.apartmentId === selectedPropertyId)
    ) {
      setSelectedPropertyId(undefined);
    }
    if (
      lastViewedPropertyId &&
      !apartments.some((apt) => apt.apartmentId === lastViewedPropertyId)
    ) {
      setLastViewedPropertyId(undefined);
    }
  }, [apartments, lastViewedPropertyId, selectedPropertyId]);

  return {
    selectedPropertyId,
    displayedPropertyId,
    isSidebarOpen,
    selectProperty,
    clearSelection,
    resetSelection,
    closeSidebar,
    handlePropertyClick,
    handleToggleSidebar,
    handleExternalClick,
  };
}
