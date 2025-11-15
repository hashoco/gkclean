import {
  FaceSmileIcon,
  ChartBarSquareIcon,
  CursorArrowRaysIcon,
  DevicePhoneMobileIcon,
  AdjustmentsHorizontalIcon,
  SunIcon,
} from "@heroicons/react/24/solid";

import benefitOneImg from "../../public/img/benefit-one.png";
import benefitTwoImg from "../../public/img/benefit-two.png";

const benefitOne = {
  title: "GKClean의 전문 세탁 공정",
  desc: "매일 필요한 세탁물을 안정적이고 위생적으로 처리하는 GKClean만의 체계적인 공정입니다. 매장의 시간을 절약하고 서비스 품질을 높입니다.",
  image: benefitOneImg,
  bullets: [
    {
      title: "정시 수거 · 정확한 물량 관리",
      desc: "예약된 시간에 맞춰 세탁물을 정시 수거하고, 매장별 물량을 정확하게 기록해 안정적으로 운영을 지원합니다.",
      icon: <FaceSmileIcon  />,
    },
    {
      title: "전문 장비 기반의 위생 세탁",
      desc: "업종별로 최적화된 세탁 공정을 적용하며, 고온 살균과 전문 세제를 사용해 항상 위생적인 결과물을 제공합니다.",
      icon: <ChartBarSquareIcon />,
    },
    {
      title: "개별 포장 · 품질 검수",
      desc: "세탁 완료 후 개별 포장과 꼼꼼한 검수를 통해 매장에 바로 사용할 수 있는 상태로 안전하게 배송합니다.",
      icon: <CursorArrowRaysIcon />,
    },
  ],
};

const benefitTwo = {
  title: "매장 운영을 더 효율적으로 만드는 서비스",
  desc: "GKClean은 단순 세탁을 넘어, 매장의 운영 안정성과 효율성을 높일 수 있는 다양한 부가 혜택을 제공합니다.",
  image: benefitTwoImg,
  bullets: [
    {
      title: "정시 배송 · 안정적인 운영",
      desc: "정확한 스케줄에 맞춰 세탁물을 배송하여 매장 운영에 차질이 없도록 지원합니다.",
      icon: <DevicePhoneMobileIcon className="h-6 w-6 text-green-600" />,
    },
    {
      title: "재고 부담 없는 타올·유니폼 운영",
      desc: "과도한 재고를 둘 필요 없이 필요한 만큼만 운영할 수 있도록 체계적인 공급을 제공합니다.",
      icon: <AdjustmentsHorizontalIcon className="h-6 w-6 text-green-600" />,
    },
    {
      title: "업종별 맞춤 요금제",
      desc: "헬스장, 피부관리실, 요가, 병원 등 업종 특성에 최적화된 단가 구성으로 경제적인 운영이 가능합니다.",
      icon: <SunIcon className="h-6 w-6 text-green-600" />,
    },
  ],
};

export {benefitOne, benefitTwo};
