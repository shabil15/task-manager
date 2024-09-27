import {  Dispatch, DragEvent, FormEvent, ReactNode, useState } from "react"
import {motion} from 'framer-motion'

interface IColumnProps {
  title: string;
  headingColor: string
  column: string
  cards: {
    title: string;
    id: string;
    column: string;
  }[]
  setCards: React.Dispatch<React.SetStateAction<{
    title: string;
    id: string;
    column: string;
  }[]>>
}


function NotionKanban() {
  return (
    <div className="h-screen w-full bg-neutral-900 text-neutral-50 ">
      <Board />

    </div>
  )
}

const Board = () => {
  const [cards, setCards] = useState(DEFAULT_CARDS);
  return <div className="flex h-full w-full gap-3 overflow-scroll p-12">
    <Column
      title="TODO"
      column="todo"
      headingColor="text-yellow-200"
      cards={cards}
      setCards={setCards}
    />
    <Column
      title="Backlog"
      column="backlog"
      headingColor="text-yellow-200"
      cards={cards}
      setCards={setCards}
    />
    <Column
      title="in progress"
      column="doing"
      headingColor="text-yellow-200"
      cards={cards}
      setCards={setCards}
    />
    <Column
      title="Completed"
      column="done"
      headingColor="text-yellow-200"
      cards={cards}
      setCards={setCards}
    />
    <BurnBarrel setCards={setCards} />
  </div>
}

const Column = ({ title, headingColor, column, cards, setCards }: IColumnProps) => {
  const filteredCards = cards.filter((c) => c.column == column)
  const [active, setActive] = useState(false)

  const handleDragStart = (e: DragEvent<HTMLDivElement>, card: {
    title: string;
    id: string;
    column: string;
  }) => {
    console.log(card.id);
    
    e.dataTransfer.setData("cardId", card.id);
  }

  const handleDragOver =(e:DragEvent<HTMLDivElement>)=>{
      e.preventDefault()
      highlightIndicator(e)
      setActive(true)
  }

  const handleDragLeave =()=>{
    clearHighlights()
    setActive(false)
  }

  const handleDragEnd =()=>{
    clearHighlights()
    setActive(false)
  }

  const highlightIndicator =(e:DragEvent<HTMLDivElement>)=>{
    const indicators = getIndicators()
    clearHighlights()
    const el = getNearesIndicator(e,indicators)
    el.element.style.opacity='1'
    // console.log(el);
    
    // el.element.setAttribute('style',"{opacity:'1'}")
  }

  const clearHighlights =()=>{
    const indicators = getIndicators()
    indicators.forEach(el=>{
      el.style.opacity='0'
    }
    )
  }
  const getNearesIndicator=(e:DragEvent<HTMLDivElement>,indicators:Element[])=>{
    const DISTANCE_OFFSET = 50;
    const el = indicators.reduce(
      (closest,child)=>{
        const box =child.getBoundingClientRect();
        const offset = e.clientY-(box.top + 
          DISTANCE_OFFSET
        );
        if(offset<0 && offset>closest.offset){
          return {offset: offset, element:child}
        }else{
          return closest;
        }
      },
      {
        offset:Number.NEGATIVE_INFINITY,
        element:indicators[indicators.length-1]
      }
    )
    return el
  }

  const getIndicators=()=>{
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  }

  return <div className="w-56 shrink-0">
    <div className="mb-3 flex items-center justify-between">
      <h3 className={`font-medium ${headingColor}`}>{title} </h3>
      <span className="rounded text-sm text-neutral-400">{filteredCards.length}</span>

    </div>
    <div
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDragEnd}
      className={`h-full w-full transition-colors ${active ? 'bg-neutral-800/50' : 'bg-neutral-800/0'}`}
    >
      {
        filteredCards.map(c => (
          <Card handleDragStart={(e)=>handleDragStart(e,c)} key={c.id} {...c} />
        ))
      }
      <DropIndicator beforeId={"-1"} column={column} />
      <AddCard column={column} setCards={setCards} />
    </div>
  </div>
}

const Card = ({ title, id, column, handleDragStart }: {
  title: string, id: string, column: string, handleDragStart: (e: DragEvent<HTMLDivElement>, card: {
    title: string;
    id: string;
    column: string;
  }) => void
}) => {
  return <>
    <DropIndicator beforeId={id} column={column} />
    <motion.div
    layout
    layoutId={id}
      onDragStart={(e) => handleDragStart(e, { title, id, column })}
      draggable="true"
      className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grab">
      <p className="text-neutral-100">
        {title}
      </p>
    </motion.div>
  </>
}

const DropIndicator = ({ beforeId, column }: { beforeId: string, column: string }) => {
  return <div
    data-before={beforeId || "-1"}
    data-column={column}
    className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
  >

  </div>
}

const BurnBarrel = ({ setCards }: {
  setCards: Dispatch<React.SetStateAction<{
    title: string;
    id: string;
    column: string;
  }[]>>
}) => {
  const [active, setActive] = useState(false)
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setActive(true)
  }
  const handleDragLeave = () => {
    setActive(false)
  }
  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    
    
    const cardId = e.dataTransfer.getData('cardId')
console.log( cardId,'<-id');

    setCards((pv) => pv.filter((c) => c.id !== cardId));

    setActive(false);

  }

  return <div
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDragEnd}
   
    className={`mt-10 grid h-56 w-56 shrink-0
  place-content-center rounded border text-3xl
  ${active
        ? "border-red-800 bg-red-800/20 text-red-500"
        : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }
  `}
  >
    {
      active ? <span className="animate-bounce">fire</span> : <span>trash</span>
    }

  </div>
}

const AddCard = ({ column, setCards }: {
  column: string, setCards: Dispatch<React.SetStateAction<{
    title: string;
    id: string;
    column: string;
  }[]>>
}) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false)
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!text.trim().length) return;
    const newCard = {
      column,
      title: text.trim(),
      id: Math.random().toString(),
    }
    setCards(prev => [...prev, newCard])
    setAdding(false)
  }
  return <>
    {
      adding ? <motion.form
      layout
        onSubmit={handleSubmit}
      >
        <textarea
          onChange={(e) => setText(e.target.value)}
          autoFocus
          placeholder="Add new task ..."
          className="w-full rounded border
      border-violet-400 bg-violet-400/20 p-3 text-sm
      text-neutral-50 placeholder-violet-300 focus:outline-0"
        />
        <div className="mt-1.5 flex items-center justify-end gap-1.5">
          <button
            onClick={() => setAdding(false)}

            className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
          >
            Close
          </button>
          <button
            type="submit"

            className=" rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
          >
            Add
          </button>
        </div>
      </motion.form>
        : <motion.button
        layout
          className={"flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"}
          onClick={() => setAdding(true)}
        ><span>Add Card</span></motion.button>
    }
  </>
}

export default NotionKanban

const DEFAULT_CARDS = [
  // BACKLOG
  { title: "Look into render bug in dashboard", id: "1", column: "backlog" },
  { title: "SOX compliance checklist", id: "2", column: "backlog" },
  { title: "[SPIKE] Migrate to Azure", id: "3", column: "backlog" },
  { title: "Document Notifications service", id: "4", column: "backlog" },
  // TODO
  {
    title: "Research DB options for new microservice",
    id: "5",
    column: "todo",
  },
  { title: "Postmortem for outage", id: "6", column: "todo" },
  { title: "Sync with product on Q3 roadmap", id: "7", column: "todo" },

  // DOING
  {
    title: "Refactor context providers to use Zustand",
    id: "8",
    column: "doing",
  },
  { title: "Add logging to daily CRON", id: "9", column: "doing" },
  // DONE
  {
    title: "Set up DD dashboards for Lambda listener",
    id: "10",
    column: "done",
  },
];