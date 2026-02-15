
import { useState, useEffect } from "react"
import { DndContext, DragOverlay, useDraggable, useDroppable, DragEndEvent } from "@dnd-kit/core"
import { User } from "lucide-react"
import { useParams } from "react-router-dom"
import { api } from "@/api"

interface Player {
  id: number
  name: string
  position: string
  overall: number
  lineupPos?: string | null
}

// Draggable Player Card
const DraggablePlayer = ({ player, id }: { player: Player, id: string }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id,
    data: { player }
  })

  // Start transformation at origin
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      className={`relative w-24 h-32 bg-card rounded-lg border-2 flex flex-col items-center justify-center p-2 shadow-md hover:shadow-xl transition-shadow cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50 z-50 ring-2 ring-primary' : 'border-border'}`}
    >
      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-xl font-bold mb-2">
        {player.name.substring(0, 1)}
      </div>
      <div className="text-center w-full">
        <p className="text-xs font-bold leading-tight truncate w-full">{player.name}</p>
        <div className="flex items-center justify-center gap-1 mt-1">
          <span className="text-[10px] px-1 bg-primary/10 text-primary rounded">{player.position}</span>
          <span className="text-[10px] font-bold">{player.overall}</span>
        </div>
      </div>
    </div>
  )
}

// Drop Zone (Position Slot)
const PositionSlot = ({ id, positionName, assignedPlayer }: { id: string, positionName: string, assignedPlayer?: Player }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  })

  return (
    <div 
      ref={setNodeRef}
      className={`w-24 h-32 border-2 border-dashed rounded-xl flex items-center justify-center transition-colors relative ${isOver ? 'border-primary bg-primary/20' : 'border-white/30 bg-black/20'}`}
    >
      {assignedPlayer ? (
        <DraggablePlayer id={`pitch-${assignedPlayer.id}`} player={assignedPlayer} />
      ) : (
        <span className="text-white/50 text-sm font-bold">{positionName}</span>
      )}
    </div>
  )
}

const TacticsView = () => {
  const { clubId } = useParams()
  const [lineup, setLineup] = useState<Record<string, Player>>({})
  const [bench, setBench] = useState<Player[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Load Players & Tactics
  useEffect(() => {
    if (clubId) {
      api.getClubPlayers(clubId).then((players: Player[]) => {
        const starters: Record<string, Player> = {}
        const subs: Player[] = []

        players.forEach(p => {
            if (p.lineupPos && formationSlots.find(s => s.id === p.lineupPos)) {
                starters[p.lineupPos] = p
            } else {
                subs.push(p)
            }
        })

        // Auto-fill if empty (First time)
        if (Object.keys(starters).length === 0 && subs.length > 0) {
             formationSlots.forEach((slot, idx) => {
                 if (subs[idx]) {
                     starters[slot.id] = subs[idx]
                     // Remove from subs (will be handled by setBench below if we filter)
                 }
             })
             // Update subs to exclude those we just picked
             // NOTE: This modifies 'subs' array in place or we need to filter?
             // Actually, let's just re-filter based on starters IDs
             const starterIds = Object.values(starters).map(p => p.id)
             const  remainingSubs = subs.filter(p => !starterIds.includes(p.id))
             
             setLineup(starters)
             setBench(remainingSubs)
             return
        }

        setLineup(starters)
        setBench(subs)
      })
    }
  }, [clubId])

  // Formation Coordinates (CSS Absolute) - 4-4-2 Classic
  // Adjusted percentages for better alignment
  const formationSlots = [
    { id: 'GK', name: 'GK', top: '85%', left: '46%' },
    { id: 'LB', name: 'LB', top: '65%', left: '10%' },
    { id: 'CB_L', name: 'CB', top: '72%', left: '34%' },
    { id: 'CB_R', name: 'CB', top: '72%', left: '58%' },
    { id: 'RB', name: 'RB', top: '65%', left: '82%' },
    { id: 'LM', name: 'LM', top: '40%', left: '10%' },
    { id: 'CM_L', name: 'CM', top: '45%', left: '34%' },
    { id: 'CM_R', name: 'CM', top: '45%', left: '58%' },
    { id: 'RM', name: 'RM', top: '40%', left: '82%' },
    { id: 'ST_L', name: 'ST', top: '15%', left: '34%' },
    { id: 'ST_R', name: 'ST', top: '15%', left: '58%' },
  ]

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    
    if (!over) return

    const player = active.data.current?.player as Player
    const slotId = over.id as string // Target Slot (e.g., 'ST_L') or 'bench'

    // Case 1: Dragging to Pitch Slot
    if (formationSlots.find(s => s.id === slotId)) {
        // Remove from previous slot (if any)
        const prevSlot = Object.keys(lineup).find(key => lineup[key].id === player.id)
        
        // Check target slot content
        const existingPlayer = lineup[slotId]
        
        // Update Lineup State
        setLineup(prev => {
            const next = { ...prev }
            if (prevSlot) delete next[prevSlot] // Remove from old pos
            next[slotId] = player
            return next
        })

        // Update Bench State
        setBench(prev => {
            let next = prev.filter(p => p.id !== player.id) // Remove dragged player from bench
            if (existingPlayer) next.push(existingPlayer) // Add swapped player to bench
            // If moved from pitch to pitch, existing player goes to bench? 
            // Better logic: Swap positions if source was pitch? 
            // For simplicity: Any displacement sends to bench.
            return next
        })
    }
    
    // Case 2: Dragging to Bench
    if (slotId === 'bench-zone') {
        const prevSlot = Object.keys(lineup).find(key => lineup[key].id === player.id)
        
        // Only if coming from pitch
        if (prevSlot) {
            setLineup(prev => {
                const next = { ...prev }
                delete next[prevSlot]
                return next
            })
            
            setBench(prev => [...prev, player]) // Add back to bench
        }
    }
  }

  const handleSave = async () => {
      if (!clubId) return
      setIsSaving(true)
      
      try {
          // Prepare payload
          // 1. Lineup Players
          const lineupUpdates = Object.entries(lineup).map(([pos, player]) => ({
              playerId: player.id,
              lineupPos: pos
          }))
          
          // 2. Bench Players (Reset lineupPos)
          const benchUpdates = bench.map(player => ({
              playerId: player.id,
              lineupPos: null
          }))

          await api.updateTactics(clubId, {
              formation: '4-4-2', // Hardcoded for now
              lineup: [...lineupUpdates, ...benchUpdates]
          })
          alert("Tactics Saved!")
      } catch (e) {
          console.error(e)
          alert("Failed to save tactics")
      } finally {
          setIsSaving(false)
      }
  }
  
  const { setNodeRef: setBenchRef, isOver: isBenchOver } = useDroppable({
    id: 'bench-zone'
  })

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-[calc(100vh-140px)] gap-6 p-6">
        
        {/* Pitch Area */}
        <div className="flex-1 bg-green-700/80 backdrop-blur rounded-xl relative shadow-2xl border-4 border-white/10 overflow-hidden flex flex-col">
             {/* Header / Save Button */}
             <div className="absolute top-4 right-4 z-10">
                 <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-white text-green-800 px-4 py-2 rounded-full font-bold shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
                 >
                    {isSaving ? "Saving..." : "Save Tactics"}
                 </button>
             </div>

             {/* Pitch Pattern (Stripes) */}
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(90deg, transparent 50%, #000 50%)', backgroundSize: '100px 100px' }} />
             
             {/* Pitch Markings */}
             <div className="absolute inset-8 border-2 border-white/40 rounded-lg pointer-events-none"></div>
             <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/40 pointer-events-none"></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/40 rounded-full pointer-events-none"></div>
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 border-2 border-t-0 border-white/40 rounded-b-lg pointer-events-none"></div>
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 border-2 border-b-0 border-white/40 rounded-t-lg pointer-events-none"></div>

             {/* Formation Slots */}
             {formationSlots.map(slot => (
               <div key={slot.id} className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ top: slot.top, left: slot.left }}>
                  <PositionSlot 
                    id={slot.id} 
                    positionName={slot.name} 
                    assignedPlayer={lineup[slot.id]} 
                   />
               </div>
             ))}
        </div>

        {/* Bench / Squad List */}
        <div 
            ref={setBenchRef}
            className={`w-80 bg-card rounded-xl border p-4 flex flex-col shadow-lg transition-colors ${isBenchOver ? 'bg-primary/10 border-primary' : ''}`}
        >
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b pb-2">
            <User className="w-5 h-5 text-primary" /> Squad ({bench.length})
          </h3>
          <div className="flex-1 overflow-auto grid grid-cols-2 gap-2 content-start pr-2">
            {bench.map(player => (
              <div key={player.id} className="scale-90 origin-top-left">
                 <DraggablePlayer id={`bench-${player.id}`} player={player} />
              </div>
            ))}
          </div>
        </div>

      </div>
      <DragOverlay>
         {activeId ? (
            <div className="w-24 h-32 bg-primary/90 rounded-lg border-2 border-primary shadow-2xl flex items-center justify-center">
              <span className="text-white font-bold">Dragging...</span>
            </div>
         ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default TacticsView
