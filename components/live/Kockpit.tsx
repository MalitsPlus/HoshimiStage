import ImageAsset from "../misc/ImageAsset";
import MyButton from "../misc/MyButton";

export default function Kockpit() {
  return (
    <div className="flex flex-row items-center overflow-visible h-20 p-4">
      <div className="w-14 h-14">
        <ImageAsset aid="img_card_thumb_1_kkr-04-casl-00" aspect="1" />
      </div>
      <div className="grow pl-4">
        <p className="text-4xl text-start align-middle truncate">あア亜abcde</p>
      </div>
      <div>
        <MyButton className="w-24 h-10">simulate</MyButton>
      </div>
    </div>
  )
}
