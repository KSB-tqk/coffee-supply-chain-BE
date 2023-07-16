import {
  ERROR_MESSAGE,
  getBlockchainMode,
  setBlockchainMode,
} from "../../enum/app_const.js";
import BlockchainMode from "../../enum/blockchain_mode.js";
import { getTransactionReceipt } from "../../helper/blockchain_helper.js";
import { onError } from "../../helper/data_helper.js";

const settingController = {
  changeBlockChainMode: (req, res) => {
    try {
      if (req.query.mode == null)
        return res
          .status(400)
          .send(onError(400, "Invalid Mode Setup" + ERROR_MESSAGE));
      setBlockchainMode(parseInt(req.query.mode, 10));

      var modeTitle = null;

      const setupMode = parseInt(req.query.mode, 10);

      switch (setupMode) {
        case BlockchainMode.Local:
          modeTitle = "Local";
          break;
        case BlockchainMode.Private:
          modeTitle = "Private";
          break;
        case BlockchainMode.Public:
          modeTitle = "Public";
          break;
      }

      console.log(req.query.mode == BlockchainMode.Public);

      res.send({
        result: "Blockchain Mode has been set to " + modeTitle + " Mode",
      });
    } catch (err) {
      res.status(500).send(onError(500, err.message));
    }
  },

  getCurrentBlockchainMode: (req, res) => {
    try {
      const mode = getBlockchainMode();

      var modeTitle = null;

      console.log(mode);
      console.log(typeof mode);

      switch (mode) {
        case BlockchainMode.Local:
          modeTitle = "Local";
          break;
        case BlockchainMode.Private:
          modeTitle = "Private";
          break;
        case BlockchainMode.Public:
          modeTitle = "Public";
          break;
      }
      res.send({
        result: "Current Blockchain Mode is " + modeTitle + " Mode",
      });
    } catch (err) {
      res.status(500).send(onError(500, err.message));
    }
  },

  getTransactionHash: async (req, res) => {
    try {
      const inputData = await getTransactionReceipt(req.query.transactionHash);

      if (inputData == null) {
        return res
          .status(404)
          .send(onError(404, "Transaction Not Found" + ERROR_MESSAGE));
      }

      return res.send({ inputData: inputData });
    } catch (err) {
      res.status(500).send(onError(500, err.message));
    }
  },
};

export default settingController;
