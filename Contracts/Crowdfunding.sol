// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Crowdfunding {
    struct Campaign {
        address creator;
        uint256 goal;
        uint256 fundsRaised;
        bool active;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public campaignCount;

    event CampaignCreated(uint256 campaignId, address creator, uint256 goal);
    event DonationReceived(uint256 campaignId, address donor, uint256 amount);

    function createCampaign(uint256 _goal) external {
        require(_goal > 0, "Goal must be greater than zero");
        
        campaignCount++;
        campaigns[campaignCount] = Campaign(msg.sender, _goal, 0, true);
        
        emit CampaignCreated(campaignCount, msg.sender, _goal);
    }

    function donate(uint256 _campaignId) external payable {
        require(_campaignId > 0 && _campaignId <= campaignCount, "Invalid campaign ID");
        require(msg.value > 0, "Donation must be greater than zero");
        
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.active, "Campaign is not active");
        
        campaign.fundsRaised += msg.value;
        
        emit DonationReceived(_campaignId, msg.sender, msg.value);
    }

    function withdrawFunds(uint256 _campaignId) external {
        require(_campaignId > 0 && _campaignId <= campaignCount, "Invalid campaign ID");
        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.creator, "Only creator can withdraw funds");
        require(campaign.fundsRaised > 0, "No funds to withdraw");
        
        uint256 amount = campaign.fundsRaised;
        campaign.fundsRaised = 0;
        campaign.active = false;
        
        payable(msg.sender).transfer(amount);
    }
}
