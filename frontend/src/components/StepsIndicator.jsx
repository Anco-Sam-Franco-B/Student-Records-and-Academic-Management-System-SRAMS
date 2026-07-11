import { Check } from "lucide-react";

export default function StepIndicator(props) {
  const steps = [
    { id: 1, title: "Trade" },
    { id: 2, title: "Class" },
    { id: 3, title: "Student" },
  ];

  return (
    <div className="w-full py-3">
      <div className="flex items-center justify-between">

        {steps.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center ${
              index !== steps.length - 1 ? "flex-1" : ""
            }`}
          >
            <div className="flex flex-col items-center">

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-300
                ${
                  props.step > item.id
                    ? "bg-green-500 text-white"
                    : props.step === item.id
                    ? "bg-blue-600 text-white ring-4 ring-blue-200"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {props.step > item.id ? (
                  <Check className="w-6 h-6" />
                ) : (
                  item.id
                )}
              </div>

              <p
                className={`mt-2 text-sm font-medium
                ${
                  props.step >= item.id
                    ? "text-blue-700"
                    : "text-gray-500"
                }`}
              >
                {item.title}
              </p>

            </div>

            {index !== steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 -mt-6 rounded-full transition-all duration-300
                ${
                  props.step > item.id
                    ? "bg-green-500"
                    : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}

      </div>
    </div>
  );
}