import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export type SeatGroup = 'balcony' | 'ground'

export type SeatSelection = null | { place: SeatGroup, row: number, column: number }

export function toSeatId(seatGroup: SeatGroup, column: number, row: number) {
  return `${seatGroup === 'balcony' ? 'b' : 'g'}-${column}-${row}`
}

export interface CinemaState {
  seatingLayout: {
    balcony: {
      rows: number,
      columns: number
    },
    ground: {
      rows: number,
      columns: number
    }
  };
  presentation: '2d' | '3d' | 'seat',
  setPresentation: (arg1: '2d' | '3d' | 'seat') => void
  reservedSeats: Record<string, boolean>;
  reserveSeat: (seatID: string) => void;
  selectedSeat: { place: SeatGroup, row: number | '', column: number | '' };
  setSelectedSeat: (selectedSeat: { place: SeatGroup, row: number | '', column: number | '' }) => void;
}

export const useCinemaStore = create<CinemaState>((set) => ({
  seatingLayout: {
    balcony: {
      rows: 9,
      columns: 20
    },
    ground: {
      rows: 21,
      columns: 20
    }
  },
  presentation: '2d',
  setPresentation: (presentation) => set((state) => ({ presentation })),
  reservedSeats: {},
  reserveSeat: (seatID) => set((state) => ({ reservedSeats: { ...state.reservedSeats, [seatID]: true } })),
  selectedSeat: { place: 'balcony', row: '', column: '' },
  setSelectedSeat: (selectedSeat) => set(() => ({ selectedSeat })),
}))

export function useSelectedSeat(): SeatSelection {
  const selectedSeat = useCinemaStore((select) => select.selectedSeat)
  const seatingLayout = useCinemaStore((select) => select.seatingLayout)
  if (selectedSeat.row === "" || selectedSeat.column === "") return null
  if (selectedSeat.row < 1 || selectedSeat.column < 1) return null
  if (selectedSeat.row > seatingLayout[selectedSeat.place].rows || selectedSeat.column > seatingLayout[selectedSeat.place].columns) return null


  return selectedSeat as { place: SeatGroup, row: number, column: number };
}