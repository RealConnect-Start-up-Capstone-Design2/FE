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
  const [isManuallyClosedByButton, setIsManuallyClosedByButton] =
    useState(false);
  const [lastViewedPropertyId, setLastViewedPropertyId] = useState<
    string | number | undefined
  >();

  const closeSidebar = useCallback((isManualClose = false) => {
    setIsSidebarOpen(false);
    if (isManualClose) {
      setIsManuallyClosedByButton(true);
    }
  }, []);

  const selectProperty = useCallback(
    (propertyId: string | number) => {
      setSelectedPropertyId(propertyId);
      setLastViewedPropertyId(propertyId);
      setIsSidebarOpen(true);
      setIsManuallyClosedByButton(false);
    },
    []
  );

  const resetSelection = useCallback(() => {
    setSelectedPropertyId(undefined);
    setIsSidebarOpen(false);
    setIsManuallyClosedByButton(false);
    setLastViewedPropertyId(undefined);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedPropertyId(undefined);
    closeSidebar();
    setIsManuallyClosedByButton(false);
  }, [closeSidebar]);

  const handlePropertyClick = useCallback(
    (propertyId: string | number) => {
      if (selectedPropertyId === propertyId) {
        clearSelection();
        return;
      }

      if (isManuallyClosedByButton) {
        setSelectedPropertyId(propertyId);
        setLastViewedPropertyId(propertyId);
      } else {
        selectProperty(propertyId);
      }
    },
    [
      clearSelection,
      isManuallyClosedByButton,
      selectProperty,
      selectedPropertyId,
    ]
  );

  const handleToggleSidebar = useCallback(() => {
    if (isSidebarOpen) {
      closeSidebar(true);
      return;
    }

    setIsManuallyClosedByButton(false);
    const firstApartmentId = apartments[0]?.apartmentId;
    const preferredTarget =
      selectedPropertyId ?? lastViewedPropertyId ?? firstApartmentId;

    const resolvedTarget = apartments.some(
      (apt) => apt.apartmentId === preferredTarget
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
