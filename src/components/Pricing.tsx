export const Pricing = () => {
  const plans = [
    {
      title: "헬스장",
      price: "400,000원~",
      desc: "타올 기준 물량 적용",
      features: ["정기 수거·배송", "전문 세탁 공정", "개별 포장 제공"],
    },
    {
      title: "미용실",
      price: "400,000원~",
      desc: "타올 기준 물량 적용",
      features: ["정기 수거·배송", "전문 세탁 공정", "업종 맞춤 공정"],
    },
    {
      title: "에스테틱 / 피부관리샵",
      price: "450,000원~",
      desc: "타올·가운 기준 물량 적용",
      features: ["위생 살균 공정", "개별 포장", "정확한 물량 관리"],
    },
  ];

  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white">
          가격 안내
        </h2>
        <p className="mt-3 text-gray-500 dark:text-gray-300">
          업종 특성에 맞춘 합리적인 요금제로 안정적인 세탁 운영을 경험하세요.
        </p>
      </div>

      <div className="grid max-w-6xl grid-cols-1 gap-8 px-6 mx-auto mt-12 md:grid-cols-3">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="p-8 bg-white shadow-lg rounded-xl border border-gray-100 dark:bg-gray-800"
          >
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
              {plan.title}
            </h3>

            <p className="mt-3 text-3xl font-bold text-green-600">
              {plan.price}
            </p>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              {plan.desc}
            </p>

            <ul className="mt-6 space-y-2 text-left">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <span className="text-green-600">✔</span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* CTA 버튼 */}
      <div className="flex justify-center mt-12">
        <a
          href="/contact"
          className="px-10 py-4 text-lg font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition shadow-md"
        >
          우리 매장 기준 견적 받기 →
        </a>
      </div>
    </section>
  );
};
