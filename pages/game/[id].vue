<script setup>
</script>

<template>
    <div class="bg-richblue h-screen font-gohu overflow-x-hidden flex flex-col">
        <Header backVisible="true" />
        <main class="grow flex flex-row justify-center space-x-4 px-4 pb-4">
            <WindowCard class="flex flex-col basis-1/4 h-full" headerText="Team Chat">
                <div id="con" class="h-full space-y-4">
                    
                    <div>
                        <div id="messagebox" class="
                        overflow-y-scroll
                        no-scrollbar
                        h-[500px]">    
                        </div>
                    </div>

                    <div class="w-fill flex space-x-2">
                        <input class="
                            flex-1        
                            basis-2/3            
                            border-black
                            rounded-vl
                            overflow-hidden
                            p-3
                            pl-5
                            pr-5
                            bg-offwhite
                            w-fill
                            placeholder:text-richgrey
                            border-4" placeholder="message"/>

                        <button class="
                            flex-1
                            basis-1/3
                            border-black
                            rounded-vl
                            overflow-hidden
                            p-3
                            pl-5
                            pr-5
                            w-fill
                            border-4 
                            bg-grapefruit">  
                            Send    
                        </button>    
                    </div>        
                </div>
            </WindowCard>
            <div class="
                flex-1 basis-2/4
                border-white
                rounded-vl
                overflow-hidden
                p-3
                pl-5
                pr-5
                bg-black
                border-4
                text-offwhite
                font-gohu
                text-xl
                h-fill
                "
                :class="[shadow ? 'drop-shadow-solid' : '']"
                >
                <h3 class="text-ellipsis text-nowrap">{{ text }}</h3>
            </div>
            <div class="flex-1 basis-1/4 h-fill grid space-y-4">
                <div class="
                    border-black
                    rounded-vl
                    overflow-hidden
                    p-3
                    pl-5
                    pr-5
                    bg-offwhite
                    border-4
                    text-offwhite
                    font-gohu
                    text-xl
                    grow
                    drop-shadow-solid
                    "
                    :class="[shadow ? 'drop-shadow-solid' : '']"
                    >
                    <h3 class="text-ellipsis text-nowrap">{{ text }}</h3>
                </div>
                <div class="
                    border-black
                    rounded-vl
                    overflow-hidden
                    p-3
                    pl-5
                    pr-5
                    bg-offwhite
                    border-4
                    text-offwhite
                    font-gohu
                    text-xl
                    grow
                    drop-shadow-solid
                    "
                    :class="[shadow ? 'drop-shadow-solid' : '']"
                    >
                    <h3 class="text-ellipsis text-nowrap">{{ text }}</h3>
                </div>
            </div>
        </main>
    </div>
</template>