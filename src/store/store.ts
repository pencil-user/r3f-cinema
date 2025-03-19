import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { clamp } from '../utilities/clamp'

const DEFAULT_BALCONY_ROWS = 9;
const DEFAULT_COLUMNS = 20;
const DEFAULT_GROUND_ROWS = 21;

export type SeatGroup = 'balcony' | 'ground'

export type SeatSelection = null | { place: SeatGroup, row: number, column: number }

export function toSeatId(seatGroup: SeatGroup, column: number, row: number) {
  return `${seatGroup === 'balcony' ? 'b' : 'g'}-${column}-${row}`
}

const initialTakenSeats:any = {}

for(let a = 1; a< DEFAULT_COLUMNS; a++) {
  for(let b = 1; b< DEFAULT_BALCONY_ROWS; b++) {
    Math.round(Math.random() * 0.6) &&  (initialTakenSeats[toSeatId('balcony', a,b)] = true)
  }
}

for(let a = 1; a< DEFAULT_COLUMNS; a++) {
  for(let b = 1; b< DEFAULT_GROUND_ROWS; b++) {
    Math.round(Math.random() * 0.6) &&  (initialTakenSeats[toSeatId('ground', a,b)] = true)
  }
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
  takenSeats: Record<string, boolean>;
  reserveSeat: (seatID: string) => void;
  unReserveSeat: (seatID: string)=> void;
  selectedSeat: { place: SeatGroup, row: number | '', column: number | '' };
  setSelectedSeat: (selectedSeat: { place: SeatGroup, row: number | '', column: number | '' }) => void;
}

export const useCinemaStore = create<CinemaState>((set) => ({
  seatingLayout: {
    balcony: {
      rows: DEFAULT_BALCONY_ROWS,
      columns: DEFAULT_COLUMNS
    },
    ground: {
      rows: DEFAULT_GROUND_ROWS,
      columns: DEFAULT_COLUMNS
    }
  },
  presentation: '2d',
  setPresentation: (presentation) => set((state) => ({ presentation })),
  reservedSeats: {},
  takenSeats: initialTakenSeats,
  reserveSeat: (seatID) => set((state) => ({ reservedSeats: { ...state.reservedSeats, [seatID]: true } })),
  unReserveSeat: (seatID) => set((state) => { const obj = {...state.reservedSeats }; delete obj[seatID]; return {reservedSeats: obj};}),
  selectedSeat: { place: 'balcony', row: '', column: '' },
  setSelectedSeat: (selectedSeat) => set((state) => {
    console.log('SETSELECTEDSEAT', selectedSeat, state)
    if (!!selectedSeat.column && !!selectedSeat.row) {
      const selection: { row: number, column: number } = {
        row: clamp(selectedSeat.row, 1, state.seatingLayout[selectedSeat.place].rows),
        column: clamp(selectedSeat.column, 1, state.seatingLayout[selectedSeat.place].columns)
      }
      console.log('stuff', selection)
      return { selectedSeat: { place: selectedSeat.place, row: selection.row, column: selection.column } }
    } else {
      return { selectedSeat }
    }

  }
  ),
}))

export function useSelectedSeat(): SeatSelection {
  const selectedSeat = useCinemaStore((select) => select.selectedSeat)
  const seatingLayout = useCinemaStore((select) => select.seatingLayout)
  if (selectedSeat.row === "" || selectedSeat.column === "") return null
  if (selectedSeat.row < 1 || selectedSeat.column < 1) return null
  if (selectedSeat.row > seatingLayout[selectedSeat.place].rows || selectedSeat.column > seatingLayout[selectedSeat.place].columns) return null

  return selectedSeat as { place: SeatGroup, row: number, column: number };
}