import { Center } from "@mantine/core"
import classNames from "classnames"
import { AttributeType, MusicChartType } from "hoshimi-venus/out/types/proto/proto_enum"
import { forwardRef, memo } from "react"

type NoteProps = {
  sequence: number,
  attribute: AttributeType,
  noteType: MusicChartType,
  notePosition: number,
  ingameIndex: number,
}

const Note = forwardRef<HTMLDivElement, NoteProps>(function _Note({
  sequence,
  attribute,
  noteType,
  notePosition,
  ingameIndex,
}: NoteProps, ref) {
  console.debug("rendered note")
  return (
    <div className="h-1 grow flex justify-center items-center cursor-pointer" ref={ref}>
      {notePosition === ingameIndex
        ? (
          <div className={classNames(
            "aspect-square rounded-full text-center font-medium text-white",
            noteType === MusicChartType.SpecialSkill ? "h-7 w-7 leading-5 border-solid border-4" : "h-5 w-5 leading-5",
            noteType === MusicChartType.SpecialSkill
              ? attribute === AttributeType.Dance ? "border-dance-acc"
                : attribute === AttributeType.Vocal ? "border-vocal-acc"
                  : attribute === AttributeType.Visual ? "border-visual-acc"
                    : "bg-slate-600" : "",
            attribute === AttributeType.Dance ? "bg-dance"
              : attribute === AttributeType.Vocal ? "bg-vocal"
                : attribute === AttributeType.Visual ? "bg-visual"
                  : "bg-slate-600"
          )}>
            <Center>
              {sequence}
            </Center>
          </div>
        )
        : <div className="h-0.5 w-0.5 bg-neutral-600/75 rounded-full z-10"></div>}
    </div>
  )
})

export default memo(Note)
