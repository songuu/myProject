import React, { memo } from 'react'

const AppLoading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative w-10 h-10">
        <div className="absolute top-0 left-0 w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-red-500"></div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full bg-gradient-to-br from-red-400 to-yellow-500 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full bg-white animate-ping"></div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full bg-white animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-red-500 animate-spin"></div>
      </div>

      {/* <div className="relative w-5 h-5">
        <div className="absolute top-0 left-0 w-full h-full rounded-full clip-auto">
          <div className="absolute top-0 left-0 w-full h-full rounded-full clip-auto">
            <div className="absolute top-0 left-0 w-full h-full rounded-full clip-auto">
              <div className="absolute top-0 left-0 w-full h-full rounded-full clip-auto bg-purple-600 animate-ping"></div>
            </div>
            <div className="absolute top-0 left-0 w-full h-full rounded-full clip-auto bg-purple-600 animate-ping"></div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full rounded-full clip-auto bg-purple-600 animate-ping"></div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full clip-auto bg-white ring-4 ring-purple-600 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full rounded-full clip-auto bg-purple-600 ring-4 ring-white animate-pulse"></div>
      </div> */}

      {/* 
      <div className="relative">
        <div className="absolute top-0 left-0 h-full w-full rounded-full overflow-hidden">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 transform rotate-45"></div>
        </div>
        <div className="absolute top-0 left-0 h-full w-full rounded-full overflow-hidden">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 transform rotate-90"></div>
        </div>
        <div className="absolute top-0 left-0 h-full w-full rounded-full overflow-hidden">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 transform rotate-135"></div>
        </div>
        <div className="absolute top-0 left-0 h-full w-full rounded-full overflow-hidden">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 transform rotate-180"></div>
        </div>
        <div className="absolute top-0 left-0 h-full w-full rounded-full overflow-hidden">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 transform rotate-225"></div>
        </div>
        <div className="absolute top-0 left-0 h-full w-full rounded-full overflow-hidden">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 transform rotate-270"></div>
        </div>
        <div className="absolute top-0 left-0 h-full w-full rounded-full overflow-hidden">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 transform rotate-315"></div>
        </div>
        <div className="relative h-12 w-12">
          <div className="absolute top-0 left-0 h-full w-full rounded-full bg-white"></div>
          <div className="absolute top-0 left-0 h-full w-full rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-spin"></div>
        </div>
      </div>
      */}
    </div>
  )
}

export default memo(AppLoading)
