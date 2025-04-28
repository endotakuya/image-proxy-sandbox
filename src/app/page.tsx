import Image from "next/image";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">画像読み込みテスト</h1>
      <div className="flex flex-col gap-y-4">
        <div>
          <h2>1. imgタグ × API Redirect</h2>
          <img src="/api/images/1" alt="" width={150} height={150} />
        </div>
        <div>
          <h2>2. next/image × API Redirect</h2>
          <Image src="/api/images/1" alt="" width={150} height={150} />
        </div>
        <div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h2>3-a. imgタグ × Image Proxy</h2>
              <img
                src="https://sandbox.enta.dev/cf/images/1"
                alt=""
                width={150}
                height={150}
              />
            </div>
            <div>
              <h2>3-b. imgタグ × Image Proxy with Resizing</h2>
              <img
                src="https://sandbox.enta.dev/cf/images/2?width=150&height=150"
                alt=""
                width={150}
                height={150}
              />
            </div>
            <div>
              <h2>3-c. imgタグ × Image Proxy with Resizing (Relative URL)</h2>
              <img
                src="/cf/images/2?width=150&height=150"
                alt=""
                width={150}
                height={150}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h2>4-a. next/image × Image Proxy</h2>
              <Image
                src="https://sandbox.enta.dev/cf/images/1"
                alt=""
                width={150}
                height={150}
                priority
              />
            </div>
            <div>
              <h2>4-b. next/image × Image Proxy with Resizing</h2>
              <Image
                src="https://sandbox.enta.dev/cf/images/2?width=150&height=150"
                alt=""
                width={150}
                height={150}
                priority
              />
            </div>
            <div>
              <h2>
                4-c. next/image × Image Proxy with Resizing (Relative URL)
              </h2>
              <Image
                src="/cf/images/2?width=150&height=150"
                alt=""
                width={150}
                height={150}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
