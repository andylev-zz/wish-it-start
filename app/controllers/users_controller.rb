
class UsersController < ApplicationController
# before_action :initialize_user

#   def initialize_user
#     @user = User.new
#   end

def new
  @user = User.new
end

def index
   @user = User.new
end



def create
    @user = User.new(params[:user])
    if @user.save
      redirect_to users_added_url, :notice => "Thanks we'll be in touch!"
    else
      render "new"
end
