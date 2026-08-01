import { makeFunctionReference } from "convex/server";

export const api = {
  programs: {
    get: makeFunctionReference("programs:get"),
    add: makeFunctionReference("programs:add"),
    remove: makeFunctionReference("programs:remove"),
    setAll: makeFunctionReference("programs:setAll"),
    updateStatus: makeFunctionReference("programs:updateStatus"),
    updateDate: makeFunctionReference("programs:updateDate"),
    updateOrder: makeFunctionReference("programs:updateOrder"),
  }
};
